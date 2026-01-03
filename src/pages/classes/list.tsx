import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { Subject, User } from "@/types";

type ClassListItem = {
  id: number;
  name: string;
  status: "active" | "inactive";
  bannerUrl?: string;
  subject?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
  capacity: number;
};

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const classColumns = useMemo<ColumnDef<ClassListItem>[]>(
    () => [
      {
        id: "banner",
        accessorKey: "bannerUrl",
        size: 120,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => {
          const bannerUrl = getValue<string>();

          return bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Class banner"
              className="ml-2 h-10 w-10 rounded-md object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-muted-foreground ml-2">No image</span>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => {
          const className = getValue<string>();

          return <span className="text-foreground">{className}</span>;
        },
      },
      {
        id: "status",
        accessorKey: "status",
        size: 140,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<"active" | "inactive">();
          const variant = status === "active" ? "default" : "secondary";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 200,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => {
          const subjectName = getValue<string>();

          return subjectName ? (
            <Badge variant="secondary">{subjectName}</Badge>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          );
        },
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 200,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => {
          const teacherName = getValue<string>();

          return teacherName ? (
            <span className="text-foreground">{teacherName}</span>
          ) : (
            <span className="text-muted-foreground">Not assigned</span>
          );
        },
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 120,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => {
          const capacity = getValue<number>();

          return <span className="text-foreground">{capacity}</span>;
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="classes"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    []
  );

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  });

  const subjects = subjectsQuery.data?.data || [];
  const teachers = teachersQuery.data?.data || [];

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const classesTable = useTable<ClassListItem>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classesTable} />
    </ListView>
  );
};

export default ClassesList;
