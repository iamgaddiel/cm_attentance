
import { createClient } from '@supabase/supabase-js'


const SB_URL = 'https://ofbagyxijgxjqmlhwltl.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmFneXhpamd4anFtbGh3bHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NTIyMjEsImV4cCI6MjAyOTEyODIyMX0.ejs3gz-I87yv8eGfF6hOEiDvs-RRnlfojCzKNTTj8ug'


// Create a single supabase client for interacting with your database
const sbClient = createClient(SB_URL, SB_KEY)



export function Config(){
    return {
        sbClient
    }
}

