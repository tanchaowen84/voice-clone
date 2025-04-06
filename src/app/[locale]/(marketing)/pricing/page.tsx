import Container from '@/components/layout/container';
import { PricingTable } from '@/components/payment/pricing-table';
import { getAllPlans } from '@/payment';

export default async function PricingPage() {
  // Get all plans as an array
  const plans = getAllPlans();

  return (
    <Container className="mt-8 px-4 max-w-6xl">
      <PricingTable plans={plans} />
    </Container>
  );
}
