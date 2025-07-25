import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const incident = await prisma.incident.findUnique({
      where: { id },
    });
    
    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }
    
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: { resolved: true },
      include: {
        camera: true,
      },
    });
    
    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error('Error resolving incident:', error);
    return NextResponse.json(
      { error: 'Failed to resolve incident' },
      { status: 500 }
    );
  }
}