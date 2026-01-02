export type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  department: string;
  createdAt?: string;
};

export type ListResponse<T = unknown> = {
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = {
  data?: T;
};

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults
        ) => void
      ) => CloudinaryWidget;
    };
  }
}

export interface UploadWidgetValue {
  url: string;
  publicId: string;
}

export interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}

export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
  department?: string;
};
