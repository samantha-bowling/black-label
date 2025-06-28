
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Validating invite token:', token)

    // Use the secure validation function we created in the database
    const { data, error } = await supabase.rpc('validate_invite_token', {
      token_param: token
    })

    if (error) {
      console.error('Database error validating invite:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to validate invite' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const validationResult = data?.[0]
    
    if (!validationResult) {
      console.log('No validation result returned')
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          error: 'Invalid or expired invite token' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Validation result:', validationResult)

    return new Response(
      JSON.stringify({
        isValid: validationResult.is_valid,
        createdBy: validationResult.created_by_user_id,
        email: validationResult.email,
        expiresAt: validationResult.expires_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
