import { Document as Document_2 } from 'llamaindex'
import { EngineResponse } from 'llamaindex'
import { StorageContext } from 'llamaindex'

export declare type Embedding = {
  model: string
}

export declare type LLM = {
  model: string
  config: Record<string, any> & {
    host: string
  }
}

export declare interface QueryParams {
  query: string
  stream: boolean
}

export declare class SRag {
  private static instance
  private embedModel
  private storageContext
  private localDocuments
  private queryEngine
  private constructor()
  private checkStorageContext
  private checkQueryEngine
  static getInstance(): SRag
  setGlobalEmbedding(embedding: Embedding): void
  setGlobalLLM(llm: LLM): void
  /**
   * 设置目录存储上下文
   * @param persistDir 存储目录的绝对路径
   * @returns 存储上下文
   */
  setStorageContext(persistDir: string): Promise<StorageContext>
  /**
   * 获取存储上下文
   * @returns 存储上下文
   */
  getStorageContext(): StorageContext | null
  /**
   * 设置本地知识文档
   * @param path 文档目录的绝对路径
   * @returns 文档列表
   * ! SimpleDirectoryReader 使用了Buffer 只能运行再node环境
   */
  /**
   * 设置文本知识文档
   * @param texts 文本列表
   * @returns 文档列表
   */
  setTextDocuments(texts: string[]): Document_2[]
  /**
   * 创建向量索引
   */
  storeVectors(): Promise<void>
  /**
   * 初始化查询引擎
   */
  initializeQueryEngine(): Promise<void>
  /**
   * 查询
   * @param queryParams 查询参数
   * @returns 查询结果
   */
  query(queryParams: QueryParams): Promise<AsyncIterable<EngineResponse>>
}

export {}
