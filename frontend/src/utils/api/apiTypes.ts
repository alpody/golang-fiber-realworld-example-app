import { paths } from "@/generated/apiSchema.generated";
import { FilterRequired, GetValueRecursive, OptionalUndefined } from "@/utils/types/utilityTypes";

export type ApiPath = keyof paths;

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type HttpMethodOfPath<P extends ApiPath> = HttpMethod & keyof FilterRequired<paths[P]>;

export type RequestParams<P extends ApiPath, M extends HttpMethodOfPath<P>> = OptionalUndefined<{
  query: GetValueRecursive<paths, [P, M, "parameters", "query"]>;
  path: GetValueRecursive<paths, [P, M, "parameters", "path"]>;
  body: GetValueRecursive<paths, [P, M, "requestBody", "content", "application/json"]>;
}>;

export const HttpSuccessCode = [200, 201, 204] as const;

export type HttpSuccessCode = (typeof HttpSuccessCode)[number];

export type ApiSuccessResponse<P extends ApiPath, M extends HttpMethodOfPath<P>> = GetValueRecursive<
  paths,
  [P, M, "responses", HttpSuccessCode, "content", "application/json"]
>;

export const HttpErrorCode = [400, 401, 403, 404, 422, 500] as const;

export type HttpErrorCode = (typeof HttpErrorCode)[number];

type ApiErrorResponseOfStatusCode<
  P extends ApiPath,
  M extends HttpMethodOfPath<P>,
  C extends HttpErrorCode,
> = C extends C
  ? {
      result: "error";
      statusCode: C;
      error: GetValueRecursive<paths, [P, M, "responses", C, "content", "application/json"]>;
    }
  : never;

export type ApiResponse<P extends ApiPath, M extends HttpMethodOfPath<P>> =
  | {
      result: "success";
      data: ApiSuccessResponse<P, M>;
    }
  | ApiErrorResponseOfStatusCode<P, M, HttpErrorCode>;
