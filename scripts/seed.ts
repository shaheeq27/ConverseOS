import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { connectDB } from "@/server/db/connect";
import UserModel from "@/server/db/models/User";
import MembershipModel from "@/server/db/models/Membership";
import { createOrganization } from "@/server/services/organization.service";
import { createWorkspace } from "@/server/services/workspace.service";
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env");
  process.exit(1);
}

async function seed() {
  console.log("🌱  Connecting to MongoDB...");
  await connectDB();

  // ──────────────────────────────────────────────
  // Clean existing data
  // ──────────────────────────────────────────────
  const collections = [
    "sessions",
    "memberships",
    "workspaces",
    "organizationsettings",
    "organizations",
    "invites",
    "users",
    "projects",
    "productinstances",
    "conversations",
    "messages",
    "dashboardconfigs",
  ];
  for (const col of collections) {
    try {
      await mongoose.connection.dropCollection(col);
    } catch {
      // Collection might not exist yet — that's fine
    }
  }
  console.log("🧹  Cleaned existing collections");

  // ──────────────────────────────────────────────
  // Users
  // ──────────────────────────────────────────────
  const alice = await UserModel.create({
    name: "Alice Kumar",
    email: "alice@converseos.ai",
    avatarColor: "#0ea5e9",
  });

  const bob = await UserModel.create({
    name: "Bob Chen",
    email: "bob@converseos.ai",
    avatarColor: "#8b5cf6",
  });

  const carol = await UserModel.create({
    name: "Carol Singh",
    email: "carol@acme.com",
    avatarColor: "#10b981",
  });

  console.log("👤  Created users: Alice (admin), Bob (admin), Carol (member)");

  // ──────────────────────────────────────────────
  // Canonical V0.3.1 organization/workspace scope
  // ──────────────────────────────────────────────
  const acmeOrganization = await createOrganization({
    name: "Acme Corp",
    slug: "acme-corp",
    userId: alice._id.toString(),
  });
  const acmeWorkspace = await createWorkspace({
    orgId: acmeOrganization._id.toString(),
    name: "Primary Workspace",
    slug: "primary",
    description: "Acme Corp's primary workspace",
    userId: alice._id.toString(),
  });
  await MembershipModel.create([
    {
      userId: bob._id,
      orgId: acmeOrganization._id,
      workspaceId: acmeWorkspace._id,
      role: "admin",
    },
    {
      userId: carol._id,
      orgId: acmeOrganization._id,
      workspaceId: acmeWorkspace._id,
      role: "member",
    },
  ]);

  const techflowOrganization = await createOrganization({
    name: "TechFlow",
    slug: "techflow",
    userId: alice._id.toString(),
  });
  const techflowWorkspace = await createWorkspace({
    orgId: techflowOrganization._id.toString(),
    name: "Primary Workspace",
    slug: "primary",
    description: "TechFlow's primary workspace",
    userId: alice._id.toString(),
  });
  await MembershipModel.create({
    userId: bob._id,
    orgId: techflowOrganization._id,
    workspaceId: techflowWorkspace._id,
    role: "member",
  });

  console.log("🔐  Created canonical organizations, workspaces, and memberships");

  // ──────────────────────────────────────────────
  // Projects
  // ──────────────────────────────────────────────
  const ProjectSchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    members: [{
      userId: mongoose.Schema.Types.ObjectId,
      role: String,
      _id: false,
    }],
  }, { timestamps: true });
  const Project = mongoose.models.Project ?? mongoose.model("Project", ProjectSchema);

  const acmeProject = await Project.create({
    name: "Acme Corp Store",
    slug: "acme-corp",
    description: "E-commerce AI assistant for Acme Corporation's sales team",
    members: [
      { userId: alice._id, role: "admin" },
      { userId: bob._id, role: "admin" },
      { userId: carol._id, role: "member" },
    ],
  });

  const techProject = await Project.create({
    name: "TechFlow SaaS",
    slug: "techflow",
    description: "B2B SaaS sales assistant for TechFlow's enterprise team",
    members: [
      { userId: alice._id, role: "admin" },
      { userId: bob._id, role: "member" },
    ],
  });

  console.log("🏢  Created projects: acme-corp, techflow");

// ──────────────────────────────────────────────
// Product Instances (FIXED)
// ──────────────────────────────────────────────

// Force clean model (avoid schema cache issues)
if (mongoose.models.ProductInstanceSeed) {
  delete mongoose.models.ProductInstanceSeed;
}

const ProductInstanceSchema = new mongoose.Schema({
  projectId: mongoose.Schema.Types.ObjectId,
  productType: String,
  namespace: String,
  name: String,
  integrations: [
    {
      type: {
        type: String,
        enum: ["shopify", "crm"],
        required: true,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
      name: String,
      config: mongoose.Schema.Types.Mixed,
      _id: false,
    },
  ],
}, { timestamps: true });

// 🔑 IMPORTANT: Use DIFFERENT model name to avoid conflict
const ProductInstance = mongoose.model(
  "ProductInstanceSeed",
  ProductInstanceSchema
);

// Insert data (NO STRINGIFY — raw objects only)
await ProductInstance.create({
  projectId: acmeProject._id,
  productType: "ai-sales-assistant",
  namespace: "acme-corp/assistant",
  name: "Acme AI Sales Assistant",
  integrations: [
    {
      type: "shopify",
      enabled: true,
      name: "Shopify Store",
      config: {
        storeUrl: "acme-corp.myshopify.com",
        apiVersion: "2024-01",
      },
    },
    {
      type: "crm",
      enabled: false,
      name: "HubSpot CRM",
      config: {
        portalId: "12345678",
        pipelineName: "Sales Pipeline",
      },
    },
  ],
});

await ProductInstance.create({
  projectId: techProject._id,
  productType: "ai-sales-assistant",
  namespace: "techflow/assistant",
  name: "TechFlow Sales Bot",
  integrations: [
    {
      type: "shopify",
      enabled: false,
      name: "Shopify Store",
      config: {},
    },
    {
      type: "crm",
      enabled: true,
      name: "Salesforce CRM",
      config: {
        instanceUrl: "https://techflow.salesforce.com",
      },
    },
  ],
});

console.log("🤖  Created product instances");
  // ──────────────────────────────────────────────
  // Sample Conversations + Messages
  // ──────────────────────────────────────────────
  const ConvSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    productInstanceId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    lastMessage: String,
  }, { timestamps: true });
  const Conversation = mongoose.models.Conversation ?? mongoose.model("Conversation", ConvSchema);

  const MsgSchema = new mongoose.Schema({
    conversationId: mongoose.Schema.Types.ObjectId,
    role: String,
    content: String,
    steps: [String],
  }, { timestamps: true });
  const Message = mongoose.models.Message ?? mongoose.model("Message", MsgSchema);

  const [acmePi] = await ProductInstance.find({ projectId: acmeProject._id });

  const conv1 = await Conversation.create({
    projectId: acmeProject._id,
    productInstanceId: acmePi._id,
    userId: carol._id,
    title: "Check inventory for headphones",
    lastMessage: "We have 23 units of Wireless Pro Headphones in stock.",
  });

  await Message.create([
    {
      conversationId: conv1._id,
      role: "user",
      content: "How many wireless headphones do we have in stock?",
      steps: [],
    },
    {
      conversationId: conv1._id,
      role: "assistant",
      content:
        "We have **23 units** of Wireless Pro Headphones in stock at $149.99 each. The Smart Watch Series 5 is running low with only 8 units — you may want to reorder soon!",
      steps: [
        "Analyzing your message...",
        "Fetching Shopify inventory & order data...",
        "Generating response...",
      ],
    },
  ]);

  const conv2 = await Conversation.create({
    projectId: acmeProject._id,
    productInstanceId: acmePi._id,
    userId: carol._id,
    title: "Latest order status",
    lastMessage: "Order #1042 is currently in transit.",
  });

  await Message.create([
    {
      conversationId: conv2._id,
      role: "user",
      content: "What is the status of our latest order?",
      steps: [],
    },
    {
      conversationId: conv2._id,
      role: "assistant",
      content:
        "Your latest order **#1042** from Emily Davis is currently **in transit** 🚚 — shipped 2 days ago for $149.99. Expected delivery by Friday. Shall I pull up more order details?",
      steps: [
        "Analyzing your message...",
        "Fetching Shopify inventory & order data...",
        "Generating response...",
      ],
    },
  ]);

  console.log("💬  Created sample conversations & messages");

  // ──────────────────────────────────────────────
  // Dashboard Configs (the KEY collection)
  // ──────────────────────────────────────────────
  const DashboardSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    title: String,
    sections: mongoose.Schema.Types.Mixed,
  }, { timestamps: true });
  const DashboardConfig = mongoose.models.DashboardConfig ?? mongoose.model("DashboardConfig", DashboardSchema);

  await DashboardConfig.create({
    projectId: acmeProject._id,
    title: "Acme Corp — Command Center",
    sections: [
      {
        id: "overview",
        label: "Overview",
        order: 1,
        icon: "BarChart3",
        widgets: [
          { id: "w1", type: "stat-card", label: "Total Conversations", dataKey: "convCount", order: 1 },
          { id: "w2", type: "stat-card", label: "Messages Sent", dataKey: "msgCount", order: 2 },
          { id: "w3", type: "stat-card", label: "Team Members", dataKey: "memberCount", order: 3 },
          { id: "w4", type: "stat-card", label: "Active Users", dataKey: "activeUsers", order: 4 },
        ],
      },
      {
        id: "integrations",
        label: "Integrations",
        order: 2,
        icon: "Plug",
        widgets: [
          { id: "w5", type: "integration-status", label: "Integration Status", dataKey: "integrations", order: 1 },
          { id: "w6", type: "toggle-list", label: "Toggle Integrations", dataKey: "integrations", order: 2 },
        ],
      },
      {
        id: "activity",
        label: "Recent Activity",
        order: 3,
        icon: "Activity",
        widgets: [
          { id: "w7", type: "message-log", label: "Recent Messages", dataKey: "recentMessages", order: 1 },
        ],
      },
    ],
  });

  await DashboardConfig.create({
    projectId: techProject._id,
    title: "TechFlow — Sales Dashboard",
    sections: [
      {
        id: "overview",
        label: "Overview",
        order: 1,
        icon: "BarChart3",
        widgets: [
          { id: "w1", type: "stat-card", label: "Total Conversations", dataKey: "convCount", order: 1 },
          { id: "w2", type: "stat-card", label: "Messages Sent", dataKey: "msgCount", order: 2 },
          { id: "w3", type: "stat-card", label: "Team Members", dataKey: "memberCount", order: 3 },
        ],
      },
      {
        id: "integrations",
        label: "Integrations",
        order: 2,
        icon: "Plug",
        widgets: [
          { id: "w5", type: "integration-status", label: "Integration Status", dataKey: "integrations", order: 1 },
        ],
      },
    ],
  });

  console.log("📊  Created dashboard configs");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log("\n✅  Seeding complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑  LOGIN AS:");
  console.log(`   Alice Kumar  (admin)  — ID: ${alice._id}`);
  console.log(`   Bob Chen     (admin)  — ID: ${bob._id}`);
  console.log(`   Carol Singh  (member) — ID: ${carol._id}`);
  console.log("\n🌐  PROJECTS:");
  console.log("   /acme-corp  — Acme Corp Store (Shopify ON, CRM OFF)");
  console.log("   /techflow   — TechFlow SaaS (Shopify OFF, CRM ON)");
  console.log("\n📊  ADMIN DASHBOARD driven by collection: dashboardconfigs");
  console.log("   Edit a document in dashboardconfigs → reload → UI changes instantly");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
