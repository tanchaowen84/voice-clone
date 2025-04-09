import Container from '@/components/layout/container';
import { PricingTable } from '@/components/payment/pricing-table';

export default async function PricingPage() {
  return (
    <Container className="mt-8 px-4 max-w-6xl">
      <PricingTable />
    </Container>
  );
}
