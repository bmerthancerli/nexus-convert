export const DEMO_USERS = [
  { id: "1", email: "demo@nexusconvert.com", password: "demo123", name: "Demo Kullanıcı" },
  { id: "2", email: "test@test.com", password: "test123", name: "Test Kullanıcı" },
];

export const registeredUsers = new Map<
  string,
  { email: string; password: string; name: string }
>();

export function findUser(email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  const demo = DEMO_USERS.find(
    (u) => u.email === normalized && u.password === password
  );
  if (demo) return { id: demo.id, email: demo.email, name: demo.name };

  const reg = registeredUsers.get(normalized);
  if (reg && reg.password === password) {
    return { id: `reg-${normalized}`, email: reg.email, name: reg.name };
  }
  return null;
}
