import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const TEST_USER = {
  email: "test@sideprojectadvisor.com",
  password: "Test1234",
};

async function seed() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: TEST_USER.email,
    password: TEST_USER.password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already exists")) {
      console.log("Test user already exists.");
    } else {
      console.error("Failed to create test user:", error.message);
      process.exit(1);
    }
    return;
  }

  console.log(`Test user created: ${data.user.email}`);
}

seed();
