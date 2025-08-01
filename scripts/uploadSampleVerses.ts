import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample verses from Genesis 1 and John 3 for testing
const sampleVerses = [
  // Genesis 1:1-10
  { book_id: 1, chapter: 1, verse: 1, text: "In the beginning God created the heavens and the earth." },
  { book_id: 1, chapter: 1, verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
  { book_id: 1, chapter: 1, verse: 3, text: "And God said, 'Let there be light,' and there was light." },
  { book_id: 1, chapter: 1, verse: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
  { book_id: 1, chapter: 1, verse: 5, text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day." },
  { book_id: 1, chapter: 1, verse: 6, text: "And God said, 'Let there be a vault between the waters to separate water from water.'" },
  { book_id: 1, chapter: 1, verse: 7, text: "So God made the vault and separated the water under the vault from the water above it. And it was so." },
  { book_id: 1, chapter: 1, verse: 8, text: "God called the vault 'sky.' And there was evening, and there was morning—the second day." },
  { book_id: 1, chapter: 1, verse: 9, text: "And God said, 'Let the water under the sky be gathered to one place, and let dry ground appear.' And it was so." },
  { book_id: 1, chapter: 1, verse: 10, text: "God called the dry ground 'land,' and the gathered waters he called 'seas.' And God saw that it was good." },
  
  // John 3:16-21 (Famous verses)
  { book_id: 43, chapter: 3, verse: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
  { book_id: 43, chapter: 3, verse: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
  { book_id: 43, chapter: 3, verse: 18, text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son." },
  { book_id: 43, chapter: 3, verse: 19, text: "This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil." },
  { book_id: 43, chapter: 3, verse: 20, text: "Everyone who does evil hates the light, and will not come into the light for fear that their deeds will be exposed." },
  { book_id: 43, chapter: 3, verse: 21, text: "But whoever lives by the truth comes into the light, so that it may be seen plainly that what they have done has been done in the sight of God." },
  
  // Psalm 23 (Popular psalm)
  { book_id: 19, chapter: 23, verse: 1, text: "The Lord is my shepherd, I lack nothing." },
  { book_id: 19, chapter: 23, verse: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
  { book_id: 19, chapter: 23, verse: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
  { book_id: 19, chapter: 23, verse: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
  { book_id: 19, chapter: 23, verse: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
  { book_id: 19, chapter: 23, verse: 6, text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever." },
  
  // Romans 8:28 (Popular verse)
  { book_id: 45, chapter: 8, verse: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  
  // Philippians 4:13 (Popular verse)
  { book_id: 50, chapter: 4, verse: 13, text: "I can do all this through him who gives me strength." },
  
  // Matthew 28:19-20 (Great Commission)
  { book_id: 40, chapter: 28, verse: 19, text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit," },
  { book_id: 40, chapter: 28, verse: 20, text: "and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age." }
];

async function uploadSampleVerses() {
  try {
    console.log("🚀 Starting sample verses upload...");
    
    // Clear existing verses including any placeholder data
    console.log("🧹 Clearing existing verses...");
    const { error: deleteError } = await supabase
      .from("verses")
      .delete()
      .gt('book_id', 0); // Delete all records
    
    if (deleteError) {
      console.error("❌ Error clearing existing verses:", deleteError);
      return;
    }
    
    console.log("✅ Existing verses cleared");
    
    // Upload sample verses
    console.log(`📖 Uploading ${sampleVerses.length} sample verses...`);
    
    const { data, error } = await supabase
      .from("verses")
      .insert(sampleVerses)
      .select();
    
    if (error) {
      console.error("❌ Upload failed:", error);
      return;
    }
    
    console.log(`🎉 Successfully uploaded ${data?.length || 0} sample verses!`);
    console.log("📝 Sample verses include:");
    console.log("  - Genesis 1:1-10 (Creation)");
    console.log("  - John 3:16-21 (God's Love)");
    console.log("  - Psalm 23 (The Lord is my Shepherd)");
    console.log("  - Romans 8:28 (All things work together)");
    console.log("  - Philippians 4:13 (I can do all things)");
    console.log("  - Matthew 28:19-20 (Great Commission)");
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

uploadSampleVerses();