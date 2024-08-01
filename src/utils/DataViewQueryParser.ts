import { DataviewApi, getAPI } from 'obsidian-dataview';
import { CardProps } from '../components/Card';

export async function parseDataviewQuery(queryConfig: any): Promise<CardProps[]> {
  const dataview: DataviewApi = getAPI();
  if (!dataview) throw new Error("Dataview plugin is not available.");

  const query = queryConfig.query || "";
  const sort = queryConfig.sort || "";
  const limit = queryConfig.limit || 10;

  const pages = dataview.pages(query).sort(sort).limit(limit);
  
  return pages.map((page: { file: { name: any; path: any; }; tags: any; }) => ({
    heading: page.file.name,
    content: page.file.path,
    tags: page.tags,
    metadata: page,  // Include metadata for potential display
  }));
}
