import { useShow } from "@refinedev/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Department, Subject, User } from "@/types";

type TeacherDetails = {
  user: User;
  classes: Array<{
    id: number;
    name: string;
    status?: "active" | "inactive";
    subject?: Subject;
    department?: Department;
  }>;
  subjects: Subject[];
  departments: Department[];
  totals: {
    classes: number;
    subjects: number;
    departments: number;
  };
};

type StudentDetails = {
  user: User;
  enrollments: Array<{
    id: number;
    class?: {
      id: number;
      name: string;
    };
    subject?: Subject;
    department?: Department;
    teacher?: Pick<User, "id" | "name" | "email" | "image">;
  }>;
  classes: Array<{ id: number; name: string }>;
  subjects: Subject[];
  totals: {
    enrollments: number;
    classes: number;
    subjects: number;
  };
};

type FacultyDetails = TeacherDetails | StudentDetails | { user: User };

const FacultyShow = () => {
  const { query } = useShow<FacultyDetails>({
    resource: "users",
  });

  const details = query.data?.data;

  if (query.isLoading || query.isError || !details) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="users" title="Faculty Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading faculty details..."
            : query.isError
            ? "Failed to load faculty details."
            : "Faculty details not found."}
        </p>
      </ShowView>
    );
  }

  const user = details.user;
  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student";

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader resource="users" title={user.name} />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <Badge variant="secondary">{user.role}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {isTeacher &&
            "totals" in details &&
            "classes" in details.totals &&
            "subjects" in details.totals &&
            "departments" in details.totals && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {details.totals.classes} classes
                </Badge>
                <Badge variant="outline">
                  {details.totals.subjects} subjects
                </Badge>
                <Badge variant="outline">
                  {details.totals.departments} departments
                </Badge>
              </div>
            )}
          {isStudent &&
            "totals" in details &&
            "enrollments" in details.totals && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {details.totals.enrollments} enrollments
                </Badge>
                <Badge variant="outline">
                  {details.totals.classes} classes
                </Badge>
                <Badge variant="outline">
                  {details.totals.subjects} subjects
                </Badge>
              </div>
            )}
        </CardContent>
      </Card>

      {isTeacher && "classes" in details && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Classes</CardTitle>
            <Badge variant="secondary">{details.totals.classes}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.classes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No classes found.
                    </TableCell>
                  </TableRow>
                )}
                {details.classes.map(
                  (classItem: {
                    id: number;
                    name: string;
                    subject?: Subject;
                    department?: Department;
                    status?: "active" | "inactive";
                  }) => (
                    <TableRow key={classItem.id}>
                      <TableCell>{classItem.name}</TableCell>
                      <TableCell>
                        {classItem.subject?.name ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        {classItem.department?.name ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            classItem.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {classItem.status ?? "unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {isStudent && "enrollments" in details && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Enrollments</CardTitle>
            <Badge variant="secondary">{details.totals.enrollments}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.enrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No enrollments found.
                    </TableCell>
                  </TableRow>
                )}
                {details.enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.class?.name ?? "Unknown"}</TableCell>
                    <TableCell>
                      {enrollment.subject?.name ?? "Unassigned"}
                    </TableCell>
                    <TableCell>
                      {enrollment.department?.name ?? "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-7">
                          {enrollment.teacher?.image && (
                            <AvatarImage
                              src={enrollment.teacher.image}
                              alt={enrollment.teacher.name}
                            />
                          )}
                          <AvatarFallback>
                            {getInitials(enrollment.teacher?.name ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {enrollment.teacher?.name ?? "Unassigned"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {enrollment.teacher?.email ?? "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default FacultyShow;
