import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Static services data from the current Services page
const existingServicesData = [
  // Wedding Day Services
  {
    title: "Premium 2-Session Package",
    category: "wedding",
    price: 2250.00,
    currency: "RM",
    features: [
      "2 Sessions for the Bride",
      "2 Sets of premium false eyelashes",
      "Professional Skin Prepping",
      "Double eyelid lifting techniques",
      "Eyebrow shaping",
      "Body glow touch-up",
      "Assistance with gown dressing",
      "Complimentary grooming (at bride's location)",
      "1 FOC Full Makeup Trial (Hair excluded)"
    ],
    description: "Premium wedding day package with two complete sessions for the bride",
    duration: "Full day service",
    status: "active",
    sort_order: 1
  },
  {
    title: "Classic 1-Session Package",
    category: "wedding",
    price: 1800.00,
    currency: "RM",
    features: [
      "1 Session for the Bride",
      "1 Set of premium false eyelashes",
      "Professional Skin Prepping",
      "Double eyelid lifting techniques",
      "Eyebrow shaping",
      "Body glow touch-up",
      "Assistance with gown dressing",
      "Complimentary grooming (at bride's location)",
      "1 FOC Full Makeup Trial (Hair excluded)"
    ],
    description: "Classic wedding day package with one complete session for the bride",
    duration: "Full day service",
    status: "active",
    sort_order: 2
  },
  // ROM Services
  {
    title: "Weekday Session",
    category: "rom",
    price: 880.00,
    currency: "RM",
    features: [
      "Makeup & Hairdo",
      "1 Set of false eyelashes",
      "Skin prepping & Double eyelid lifting",
      "Eyebrow shaping & Body glow",
      "Assistance with gown"
    ],
    description: "Registration of Marriage makeup and hairdo for weekday ceremonies",
    duration: "Half day service",
    status: "active",
    sort_order: 3
  },
  {
    title: "Weekend Session",
    category: "rom",
    price: 1180.00,
    currency: "RM",
    features: [
      "Makeup & Hairdo",
      "1 Set of false eyelashes",
      "Skin prepping & Double eyelid lifting",
      "Eyebrow shaping & Body glow",
      "Assistance with gown"
    ],
    description: "Registration of Marriage makeup and hairdo for weekend ceremonies",
    duration: "Half day service",
    status: "active",
    sort_order: 4
  },
  // Pre-Wedding Photography
  {
    title: "Half Day Session",
    category: "pre-wedding",
    price: 1300.00,
    currency: "RM",
    features: [
      "2 Hours Makeup Time",
      "Max 4 Hours Follow-out",
      "1 Makeup Style & Max 2 Hair Styles",
      "Simple touch-up/hairdo for Groom"
    ],
    description: "Pre-wedding photography makeup and styling for half day shoots",
    duration: "4 hours maximum",
    status: "active",
    sort_order: 5
  },
  {
    title: "Full Day Session",
    category: "pre-wedding",
    price: 2000.00,
    currency: "RM",
    features: [
      "2 Hours Makeup Time",
      "Max 6 Hours Follow-out",
      "2 Makeup Styles & 3 Hair Styles",
      "Inclusive of Bridal Hair Accessories",
      "Skin Prepping & False Lashes",
      "Simple touch-up/hairdo for Groom"
    ],
    description: "Pre-wedding photography makeup and styling for full day shoots",
    duration: "6 hours maximum",
    note: "Client to cover transport/accommodation for destination shoots.",
    status: "active",
    sort_order: 6
  },
  // Add-on Services
  {
    title: "Touch-up & Restyle",
    category: "addon",
    price: 450.00,
    currency: "RM",
    features: [
      "Up to 3 hours service",
      "Makeup touch-ups",
      "Hair restyling",
      "Outfit assistance"
    ],
    description: "Additional touch-up and restyle service",
    duration: "Up to 3 hours",
    status: "active",
    sort_order: 7
  },
  {
    title: "Additional Makeup Trial",
    category: "addon",
    price: 400.00,
    currency: "RM",
    features: [
      "Complete makeup application",
      "Style consultation",
      "Photo session for reference",
      "Adjustments and refinements"
    ],
    description: "Extra makeup trial session beyond the included FOC trial",
    duration: "2-3 hours",
    status: "active",
    sort_order: 8
  },
  {
    title: "Additional Hair Trial",
    category: "addon",
    price: 300.00,
    currency: "RM",
    features: [
      "Hair styling session",
      "Style consultation",
      "Photo session for reference",
      "Adjustments and refinements"
    ],
    description: "Extra hair trial session for perfecting your look",
    duration: "1-2 hours",
    status: "active",
    sort_order: 9
  },
  {
    title: "Family Member Makeup & Hair",
    category: "addon",
    price: 380.00,
    currency: "RM",
    features: [
      "Complete makeup application",
      "Hair styling",
      "Minimum 2 persons required",
      "Suitable for mothers, bridesmaids, etc."
    ],
    description: "Makeup and hair service for family members and bridal party",
    duration: "1.5 hours per person",
    note: "Minimum 2 persons required for booking",
    status: "active",
    sort_order: 10
  },
  {
    title: "Personal Makeup & Hair",
    category: "personal",
    price: 650.00,
    currency: "RM",
    features: [
      "Complete makeup application by Mae",
      "Professional hair styling",
      "Suitable for events, photoshoots, special occasions",
      "Premium service quality"
    ],
    description: "Personal makeup and hair service by Mae for special occasions",
    duration: "2-3 hours",
    status: "active",
    sort_order: 11
  }
];

export async function migrateServicesData() {
  if (!supabase) {
    console.error('Supabase is not configured. Please check your environment variables.');
    return;
  }

  try {
    console.log('Starting services data migration...');

    // Check if services already exist
    const { data: existingServices, error: checkError } = await supabase
      .from('services')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing services:', checkError);
      return;
    }

    if (existingServices && existingServices.length > 0) {
      console.log('Services already exist in database. Skipping migration.');
      return;
    }

    // Insert services data
    const { data, error } = await supabase
      .from('services')
      .insert(existingServicesData)
      .select();

    if (error) {
      console.error('Error migrating services data:', error);
      return;
    }

    console.log(`Successfully migrated ${data?.length || 0} services to database`);
    console.log('Services migration completed successfully!');

    // Log the migrated services
    data?.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.category}) - ${service.currency} ${service.price}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateServicesData();