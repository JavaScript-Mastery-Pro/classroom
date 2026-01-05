import { useLink, useShow } from "@refinedev/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import type { Department, Subject, User } from "@/types";

type DepartmentDetails = {
  department: Department;
  subjects: Array<Subject & { totalClasses: number }>;
  classes: Array<{
    id: number;
    name: string;
    status?: "active" | "inactive";
    subject?: { name: string };
    teacher?: Pick<User, "id" | "name" | "email" | "image">;
  }>;
  enrolledStudents: Array<Pick<User, "id" | "name" | "email" | "image">>;
  totals: {
    subjects: number;
    classes: number;
    enrolledStudents: number;
  };
};

const DepartmentShow = () => {
  const Link = useLink();
  const { query } = useShow<DepartmentDetails>({
    resource: "departments",
  });

  const details = query.data?.data;

  if (query.isLoading || query.isError || !details) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="departments" title="Department Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading department details..."
            : query.isError
            ? "Failed to load department details."
            : "Department details not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader resource="departments" title={details.department.name} />

      <div>
        <p className="text-sm text-muted-foreground">
          {details.department.description ?? "No description provided."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {details.totals.subjects}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {details.totals.classes}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Enrolled Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {details.totals.enrolledStudents}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.subjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No subjects assigned.
                  </TableCell>
                </TableRow>
              )}
              {details.subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <Badge variant="secondary">{subject.code}</Badge>
                  </TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {subject.description ?? "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge>{subject.totalClasses}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.classes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No classes available.
                  </TableCell>
                </TableRow>
              )}
              {details.classes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link to={`/classes/show/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell>{item.subject?.name ?? "Unassigned"}</TableCell>
                  <TableCell>{item.teacher?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "active" ? "default" : "secondary"
                      }
                    >
                      {item.status ?? "unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.enrolledStudents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No enrolled students yet.
              </p>
            )}
            {details.enrolledStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-md border border-border p-3"
              >
                <Avatar>
                  {student.image && (
                    <AvatarImage src={student.image} alt={student.name} />
                  )}
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export default DepartmentShow;
