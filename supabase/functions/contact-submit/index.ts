
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  companyOrganization?: string;
  inquiryCategory?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Contact form submission received');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log('Form data received:', { ...formData, message: '[REDACTED]' });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client info for tracking
    const userAgent = req.headers.get('user-agent');
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const referer = req.headers.get('referer');

    // Get current user if authenticated
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }

    // Store in database
    const { data, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        company_organization: formData.companyOrganization || null,
        inquiry_category: formData.inquiryCategory || 'general',
        user_id: userId,
        ip_address: clientIp,
        user_agent: userAgent,
        referrer_page: referer
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save contact message');
    }

    console.log('Contact message saved to database:', data.id);

    // Send email notification using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    const contactEmail = Deno.env.get('CONTACT_EMAIL') || 'hello@blacklabel.gg';

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: 'BlackLabel.gg <noreply@blacklabel.gg>',
      to: [contactEmail],
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        ${formData.companyOrganization ? `<p><strong>Company/Organization:</strong> ${formData.companyOrganization}</p>` : ''}
        <p><strong>Category:</strong> ${formData.inquiryCategory || 'general'}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${formData.message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="color: #666; font-size: 12px;">
          <strong>Submitted:</strong> ${new Date().toISOString()}<br>
          <strong>IP:</strong> ${clientIp}<br>
          <strong>User Agent:</strong> ${userAgent}<br>
          ${referer ? `<strong>Referrer:</strong> ${referer}<br>` : ''}
          <strong>Message ID:</strong> ${data.id}
        </p>
      `,
    });

    if (adminEmailResponse.error) {
      console.error('Failed to send admin notification:', adminEmailResponse.error);
    } else {
      console.log('Admin notification sent successfully');
    }

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: 'BlackLabel.gg <noreply@blacklabel.gg>',
      to: [formData.email],
      subject: 'Thank you for contacting BlackLabel.gg',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${formData.firstName},</p>
        <p>We've received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <strong>Subject:</strong> ${formData.subject}<br><br>
          ${formData.message.replace(/\n/g, '<br>')}
        </div>
        <p>Best regards,<br>The BlackLabel.gg Team</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      `,
    });

    if (userEmailResponse.error) {
      console.error('Failed to send user confirmation:', userEmailResponse.error);
    } else {
      console.log('User confirmation sent successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: data.id
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in contact-submit function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
