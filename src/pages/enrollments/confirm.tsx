import { useLocation, useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowView } from "@/components/refine-ui/views/show-view";

type EnrollmentDetails = {
  id: number;
  class?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
  };
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
};

const EnrollmentConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const enrollment = (location.state as { enrollment?: EnrollmentDetails })
    ?.enrollment;

  if (!enrollment) {
    return (
      <ShowView className="class-view">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No enrollment details found.
            </p>
            <Button className="mt-4" onClick={() => navigate("/classes")}>
              Browse Classes
            </Button>
          </CardContent>
        </Card>
      </ShowView>
    );
  }

  return (
    <ShowView className="class-view space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You have been enrolled successfully.
          </p>
          <div className="flex flex-wrap gap-2">
            {enrollment.department && (
              <Badge variant="secondary">{enrollment.department.name}</Badge>
            )}
            {enrollment.subject && (
              <Badge variant="outline">{enrollment.subject.name}</Badge>
            )}
            {enrollment.class && (
              <Badge variant="outline">{enrollment.class.name}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Class</p>
            <p className="text-base font-semibold">
              {enrollment.class?.name ?? "Unknown"}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground">Teacher</p>
            <p className="text-base font-semibold">
              {enrollment.teacher?.name ?? "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {enrollment.teacher?.email ?? "No email"}
            </p>
          </div>
          <Separator />
          <div className="flex gap-2">
            <Button onClick={() => navigate("/classes")}>View Classes</Button>
            {enrollment.class?.id && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/classes/show/${enrollment.class?.id}`)
                }
              >
                Go to Class
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default EnrollmentConfirm;
