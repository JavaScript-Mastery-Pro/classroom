import { useRegister, useLink } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { ROLE_OPTIONS } from "@/constants";
import UploadWidget from "@/components/upload-widget";
import { UserRole } from "@/types";
import { toast } from "sonner";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(3, "Full name must be at least 3 characters"),
  role: z.nativeEnum(UserRole),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SignUpForm = () => {
  const Link = useLink();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: UserRole.STUDENT,
      image: "",
      imageCldPubId: "",
    },
  });

  const imagePublicId = form.watch("imageCldPubId");

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      register(
        {
          ...values,
          name: values.name,
          image: values.image || undefined,
          imageCldPubId: values.imageCldPubId || undefined,
        },
        {
          onSuccess: (data) => {
            if (data.success === false) {
              toast.error(data.error?.message, {
                richColors: true,
              });
              return;
            }

            toast.success("Account created successfully!", {
              richColors: true,
            });
            form.reset();
          },
        }
      );
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        richColors: true,
      });
    }
  };

  return (
    <div className="sign-up">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <Card className="card">
        <CardHeader className="header">
          <CardTitle className="title">Register</CardTitle>
          <CardDescription className="description">
            Create an account to get started.
          </CardDescription>
        </CardHeader>

        <CardContent className="content">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form">
              {/* User Type Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <div className="roles">
                        {ROLE_OPTIONS.map((role) => {
                          return (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => field.onChange(role.value)}
                              className={cn(
                                "role-button",
                                field.value === role.value && "is-active"
                              )}
                            >
                              <role.icon />
                              <span>{role.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Photo Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <UploadWidget
                        value={
                          field.value
                            ? {
                                url: field.value,
                                publicId: imagePublicId ?? "",
                              }
                            : null
                        }
                        onChange={(file) => {
                          if (file) {
                            field.onChange(file.url);
                            form.setValue("imageCldPubId", file.publicId, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            field.onChange("");
                            form.setValue("imageCldPubId", "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="submit"
                disabled={form.formState.isSubmitting || isRegistering}
              >
                {form.formState.isSubmitting || isRegistering
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="footer">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </CardFooter>
      </Card>
    </div>
  );
};
