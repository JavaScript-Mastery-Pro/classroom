import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";

import { Subject } from "@/types";

const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS501",
    name: "Advanced Algorithms",
    department: "Computer Science",
    description:
      "Deep dive into graph theory, dynamic programming, and distributed algorithms.",
  },
  {
    id: 2,
    code: "MAT320",
    name: "Applied Linear Algebra",
    department: "Mathematics",
    description:
      "Matrix factorization and vector spaces with practical data science applications.",
  },
  {
    id: 3,
    code: "PHY210",
    name: "Modern Physics",
    department: "Physics",
    description:
      "Covers relativity, quantum theory, and the experimental foundations of physics.",
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return {
        data: [] as TData[],
        total: 0,
      };
    }

    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },
  getOne: async () => {
    throw new Error("getOne is not implemented in the mock data provider");
  },
  create: async () => {
    throw new Error("create is not implemented in the mock data provider");
  },
  update: async () => {
    throw new Error("update is not implemented in the mock data provider");
  },
  deleteOne: async () => {
    throw new Error("deleteOne is not implemented in the mock data provider");
  },
  getApiUrl: () => "",
};
