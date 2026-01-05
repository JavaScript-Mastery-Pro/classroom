import { useLink, useShow } from "@refinedev/core";

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
import type { ClassDetails, Department, Subject, User } from "@/types";

type SubjectDetails = {
  subject: Subject & {
    department?: Department | null;
  };
  classes: Array<
    ClassDetails & {
      teacher?: Pick<User, "id" | "name" | "email" | "image">;
    }
  >;
  totals: {
    classes: number;
  };
};

const SubjectsShow = () => {
  const Link = useLink();

  const { query } = useShow<SubjectDetails>({
    resource: "subjects",
  });

  const details = query.data?.data;

  if (query.isLoading || query.isError || !details) {
    return (
      <ShowView className="class-view">
        <ShowViewHeader resource="subjects" title="Subject Details" />
        <p className="text-sm text-muted-foreground">
          {query.isLoading
            ? "Loading subject details..."
            : query.isError
            ? "Failed to load subject details."
            : "Subject details not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <ShowViewHeader resource="subjects" title={details.subject.name} />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex w-full flex-row items-center justify-between">
          <CardTitle>Subject Overview</CardTitle>
          <Badge variant="secondary">{details.subject.code}</Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {details.subject.description ?? "No description provided."}
          </p>
        </CardContent>
      </Card>

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
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacity</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-7">
                        {item.teacher?.image && (
                          <AvatarImage
                            src={item.teacher.image}
                            alt={item.teacher.name}
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(item.teacher?.name ?? "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {item.teacher?.name ?? "Unassigned"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.teacher?.email ?? "No email"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "active" ? "default" : "secondary"
                      }
                    >
                      {item.status ?? "unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.capacity ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

export default SubjectsShow;
