import ServerDetail from '@/components/server-detail';
import { notFound } from 'next/navigation';

interface ServerPageProps {
  params: {
    id: string;
  };
}

export default async function ServerPage({ params }: ServerPageProps) {
  const id = await Promise.resolve(params.id);
  
  if (!id) {
    notFound();
  }
  
  return <ServerDetail serverId={id} />;
} 