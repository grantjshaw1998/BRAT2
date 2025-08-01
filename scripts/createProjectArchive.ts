import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function createProjectArchive() {
  try {
    console.log("📦 Creating project archive...");
    
    const projectRoot = process.cwd();
    const archiveDir = path.join(projectRoot, "archive");
    
    // Create archive directory
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Copy important files and directories
    const filesToCopy = [
      "src",
      "public", 
      "scripts",
      "supabase",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "tsconfig.node.json",
      "vite.config.ts",
      "tailwind.config.js",
      "postcss.config.cjs",
      "components.json",
      "index.html",
      "README.md",
      ".gitignore",
      "UPLOAD_TO_GITHUB.md"
    ];

    console.log("📁 Copying project files...");
    
    for (const item of filesToCopy) {
      const sourcePath = path.join(projectRoot, item);
      const destPath = path.join(archiveDir, item);
      
      if (fs.existsSync(sourcePath)) {
        const stats = fs.statSync(sourcePath);
        
        if (stats.isDirectory()) {
          // Copy directory recursively
          copyDirectory(sourcePath, destPath);
          console.log(`✅ Copied directory: ${item}`);
        } else {
          // Copy file
          fs.copyFileSync(sourcePath, destPath);
          console.log(`✅ Copied file: ${item}`);
        }
      } else {
        console.log(`⚠️ Skipped (not found): ${item}`);
      }
    }

    // Create project info file
    const projectInfo = {
      name: "Bible Research App v2.0",
      version: "2.0.0",
      description: "Modern Bible study app with advanced search, note-taking, highlighting, and collaborative study features",
      created: new Date().toISOString(),
      technologies: [
        "React 18",
        "TypeScript",
        "Vite",
        "Supabase",
        "Tailwind CSS",
        "PostgreSQL"
      ],
      features: [
        "Complete Bible with 66 books",
        "Advanced full-text search",
        "Personal note-taking system",
        "Verse highlighting",
        "Study circles/groups",
        "Reading plans",
        "User authentication",
        "Responsive design"
      ],
      setup_instructions: [
        "1. Install Node.js 18+",
        "2. Run 'npm install'",
        "3. Set up Supabase project",
        "4. Configure environment variables",
        "5. Run database migrations",
        "6. Upload Bible data",
        "7. Start with 'npm run dev'"
      ]
    };

    fs.writeFileSync(
      path.join(archiveDir, "PROJECT_INFO.json"),
      JSON.stringify(projectInfo, null, 2)
    );

    console.log("\n🎉 Project archive created successfully!");
    console.log(`📁 Archive location: ${archiveDir}`);
    console.log("\n📋 Archive contents:");
    console.log("  ✅ Complete source code (src/)");
    console.log("  ✅ Database scripts (scripts/)");
    console.log("  ✅ Supabase migrations (supabase/)");
    console.log("  ✅ Configuration files");
    console.log("  ✅ Documentation");
    console.log("  ✅ Project info and setup instructions");

  } catch (error) {
    console.error("❌ Archive creation failed:", error);
  }
}

function copyDirectory(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

createProjectArchive();