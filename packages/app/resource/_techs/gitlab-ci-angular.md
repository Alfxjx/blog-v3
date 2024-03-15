---
title: 'Gitlab CI 配置一个基于tag的发布流水线'
excerpt: '总结下，现在终于可以不用自己的电脑去build了'
coverImage: ''
date: '2024-03-15T15:42:22.712Z'
type: tech
tag: ['GitLab', 'CI']
author:
  name: Alfxjx
  picture: '/assets/authors/alfxjx.jpg'
---

## tl;dr

```yaml

# https://dev.to/angelalexqc/building-a-rock-solid-angular-cicd-pipeline-with-gitlab-a-step-by-step-guide-1fjl
default:
  interruptible: true
  image: node:16.15.1

stages:
  - dependencies
  - build
  - release

install:
  stage: dependencies
  script:
    # Install dependencies
    - npm config set registry http://<ip_addr>/repository/npm-group/
    - npm install --prefer-offline --legacy-peer-deps --frozen-lockfile
  cache:
    key:
      files:
        - package.json
    paths:
      - node_modules
  only:
    - tags

build:
  stage: build
  script:
    - apt-get update -y
    - apt-get install -y zip
    - apt-get install -y original-awk
    - touch $CI_PROJECT_DIR/job.env
    - echo "$CI_JOB_ID" > $CI_PROJECT_DIR/job.env
    - original-awk '/^### \[[0-9]+\.[0-9]+\.[0-9]+\]/ { if (++count == 2) exit } 1' CHANGELOG.md > latest_version.md
    - npm run build:ci
    - cd dist/<your_app> && zip -r ../<your_app>.zip .
  artifacts:
    paths:
      - $CI_PROJECT_DIR/dist/<your_app>.zip
      - $CI_PROJECT_DIR/job.env
      - $CI_PROJECT_DIR/latest_version.md
    expire_in: 1 week

  cache:
    key:
      files:
        - package.json
    paths:
      - node_modules
    policy: pull
  only:
    - tags

release_job:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  needs:
    - job: build
      artifacts: true
  dependencies:
    - build
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v?\d+\.\d+\.\d+$/'
  script:
    - echo "Creating release"
    - JOB_ID=$(cat job.env) # Read JOB_ID from job.env
    - echo JOB_ID $JOB_ID
    - >
      release-cli create --name "Release $CI_COMMIT_TAG" --description "$(cat latest_version.md)" --tag-name "$CI_COMMIT_TAG" --ref "$CI_COMMIT_SHA" --assets-link "{\"name\": \"<your_app>.zip\", \"url\": \"http://<repo_url>/-/jobs/$JOB_ID/artifacts/raw/dist/<your_app>.zip?job=build\" }"


```

## 解释和说明

上面的配置文件现在来解释下作用。

### default

标记了项目默认情况下使用的镜像，本项目中是 node:16.15.1 版本，这个应该是一个基于 debian 的镜像。

### stages

表示这个流水线包含哪些步骤，这个和 gitlab  的 pipeline 里的jobs是一一对应的。这里有三个

```yaml

stages:
  - dependencies
  - build
  - release

```

### install

```yaml
install:
  stage: dependencies
  script:
    # Install dependencies
    - npm config set registry http://<ip_addr>/repository/npm-group/
    - npm install --prefer-offline --legacy-peer-deps --frozen-lockfile
  cache:
    key:
      files:
        - package.json
    paths:
      - node_modules
  only:
    - tags

```

- 这里表示一个操作，里面的 `stage`属性表示其属于哪一个stage。这里的install执行了安装依赖的功能。
- `cache`表示安装完的缓存，这里将 node_modules 保存下来给后面的流程使用（并且这里以文件作为key，这样后续的pipeline中也有可能会用到这个缓存。）
- `only:tags` 表示只在收到新的tag的时候才触发。

### build

```yaml

build:
  stage: build
  script:
    - apt-get update -y
    - apt-get install -y zip
    - apt-get install -y original-awk
    - touch $CI_PROJECT_DIR/job.env
    - echo "$CI_JOB_ID" > $CI_PROJECT_DIR/job.env
    - original-awk '/^### \[[0-9]+\.[0-9]+\.[0-9]+\]/ { if (++count == 2) exit } 1' CHANGELOG.md > latest_version.md
    - npm run build:ci
    - cd dist/<your_app> && zip -r ../<your_app>.zip .
  artifacts:
    paths:
      - $CI_PROJECT_DIR/dist/<your_app>.zip
      - $CI_PROJECT_DIR/job.env
      - $CI_PROJECT_DIR/latest_version.md
    expire_in: 1 week

  cache:
    key:
      files:
        - package.json
    paths:
      - node_modules
    policy: pull
  only:
    - tags

```

- 这个job是用来进行打包的，注意到是基于 debian 的镜像，所以这里使用 `apt-get` 
- `zip` 安装这个lib，用于压缩生成的dist文件夹
- `original-awk`用于截取最新的CHANGELOG
- `echo "$CI_JOB_ID" > $CI_PROJECT_DIR/job.env` 这个语句是用来保存当前的 JOB_ID，给后续生成下载链接使用
- 生成的产物会保存在 artifacts 里，并设置了过期时间

### release_job

```yaml

release_job:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  needs:
    - job: build
      artifacts: true
  dependencies:
    - build
  rules:
    - if: '$CI_COMMIT_TAG =~ /^v?\d+\.\d+\.\d+$/'
  script:
    - echo "Creating release"
    - JOB_ID=$(cat job.env) # Read JOB_ID from job.env
    - echo JOB_ID $JOB_ID
    - >
      release-cli create --name "Release $CI_COMMIT_TAG" --description "$(cat latest_version.md)" --tag-name "$CI_COMMIT_TAG" --ref "$CI_COMMIT_SHA" --assets-link "{\"name\": \"<your_app>.zip\", \"url\": \"http://<repo_url>/-/jobs/$JOB_ID/artifacts/raw/dist/<your_app>.zip?job=build\" }"
```

- 这里生成 release 需要使用 gitlab 官方的一个 release-cli 的镜像
- needs 表示这个job基于build并使用build的产物
- rules 表示版本号的格式要求 目前只要是 （v）1.1.2都可以，比较宽松
- 脚本中从文件获取了上一个build 的 JOB_ID
- 后面调用了 release-cli 去创建 release
	-  `--description` 是 上面的最新的changelog
	-  `--assets-link` 是主动加上去的附件，这里拼接了一个地址，是上面的build中的产物


## 优化

1. 只有满足特定格式的tag才去生成release
2. 打包生成的文件名称加上build时间和版本tag
3. 区分build number 和 version
