type FileKeys =
  | 'title'
  | 'date'
  | 'type'
  | 'tag'
  | 'slug'
  | 'content'
  | 'coverImage'
  | 'excerpt';

type ResponseItem = Partial<Record<FileKeys, string>>;

type FileTypes = '_techs' | '_blogs' | '_about' | '_short';

export { FileKeys, ResponseItem, FileTypes };
