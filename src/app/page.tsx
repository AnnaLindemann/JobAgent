export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Job Agent</h1>
      <p style={{ marginBottom: 16 }}>
        Setup is OK. Next step: /api/health and env schema.
      </p>
      <ul>
        <li>/api/health</li>
        <li>env validation</li>
        <li>Job Tracker data layer</li>
      </ul>
    </main>
  );
}
