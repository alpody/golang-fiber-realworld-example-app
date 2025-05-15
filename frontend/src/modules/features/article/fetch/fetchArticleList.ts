import { calcOffsetLimitFromPageNumber } from "@/modules/common/functions/pagination";
import { createApiClient } from "@/utils/api/apiClient";
import { ArticlePreview } from "@/utils/types/models";

export const fetchArticlesByAuthor = async (authorUsername: string, pageNumber: number) => {
  const { offset, limit } = calcOffsetLimitFromPageNumber(pageNumber, 10);

  const client = createApiClient({
    path: "/articles",
    method: "get",
    params: {
      query: {
        author: authorUsername,
        offset,
        limit,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return {
      articles: response.data.articles.map((article) => ArticlePreview.parse(article)),
      articlesCount: response.data.articlesCount,
    };
  }

  throw new Error("api error.");
};

export const fetchArticlesByTag = async (tag: string, page: number) => {
  const { offset, limit } = calcOffsetLimitFromPageNumber(page, 10);

  const client = createApiClient({
    path: "/articles",
    method: "get",
    params: {
      query: {
        tag,
        limit,
        offset,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return {
      articles: response.data.articles.map((article) => ArticlePreview.parse(article)),
      articlesCount: response.data.articlesCount,
    };
  }

  throw new Error("api error.");
};

export const fetchFavoriteArticles = async (username: string, pageNumber: number) => {
  const { offset, limit } = calcOffsetLimitFromPageNumber(pageNumber, 10);

  const client = createApiClient({
    path: "/articles",
    method: "get",
    params: {
      query: {
        favorited: username,
        offset,
        limit,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return {
      articles: response.data.articles.map((article) => ArticlePreview.parse(article)),
      articlesCount: response.data.articlesCount,
    };
  }

  throw new Error("api error.");
};

export const fetchFeedArticles = async (page: number) => {
  const { offset, limit } = calcOffsetLimitFromPageNumber(page, 10);

  const client = createApiClient({
    path: "/articles/feed",
    method: "get",
    params: {
      query: {
        limit,
        offset,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return {
      articles: response.data.articles.map((article) => ArticlePreview.parse(article)),
      articlesCount: response.data.articlesCount,
    };
  }

  throw new Error("api error.");
};

export const fetchGlobalArticles = async (page: number) => {
  const { offset, limit } = calcOffsetLimitFromPageNumber(page, 10);

  const client = createApiClient({
    path: "/articles",
    method: "get",
    params: {
      query: {
        limit,
        offset,
      },
    },
  });

  const response = await client.sendRequest();

  if (response.result === "success") {
    return {
      articles: response.data.articles.map((article) => ArticlePreview.parse(article)),
      articlesCount: response.data.articlesCount,
    };
  }

  throw new Error("api error.");
};
