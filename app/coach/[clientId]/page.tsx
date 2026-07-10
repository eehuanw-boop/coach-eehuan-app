import { CoachClientDetail } from "@/components/CoachClientDetail";

export default async function CoachClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <CoachClientDetail clientId={clientId} />;
}
