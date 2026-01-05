import { useLink, useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import type { Department, Subject } from "@/types";

type SubjectDetails = {
  subject: Subject & {
    department?: Department | null;
  };
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
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{details.totals.classes} classes</Badge>
            {details.subject.department && (
              <Badge variant="outline">
                <Link to={`/departments/show/${details.subject.department.id}`}>
                  {details.subject.department.name}
                </Link>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {details.subject.description ?? "No description provided."}
          </p>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectsShow;
