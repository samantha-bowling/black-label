// @ts-nocheck

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  companyOrganization: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactModalProps {
  children?: React.ReactNode;
}

export function ContactModal({ children }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
      companyOrganization: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    console.log('Submitting contact form:', { ...data, message: '[REDACTED]' });

    try {
      const { data: response, error } = await supabase.functions.invoke('contact-submit', {
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          subject: data.subject,
          message: data.message,
          companyOrganization: data.companyOrganization,
          inquiryCategory: 'general'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to submit contact form');
      }

      console.log('Contact form submitted successfully:', response.id);

      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      form.reset();
      setIsOpen(false);

    } catch (error: any) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center">
            <Mail className="w-3 h-3 mr-1" />
            Contact Us
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contact BlackLabel.gg
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Get in touch with our team. We'd love to hear from you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-background border-border text-white"
                        placeholder="Your first name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-background border-border text-white"
                        placeholder="Your last name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="bg-background border-border text-white"
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Company/Organization (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background border-border text-white"
                      placeholder="Your company or organization"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Subject</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-background border-border text-white"
                      placeholder="What's this about?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-background border-border text-white min-h-[120px]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-white/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
