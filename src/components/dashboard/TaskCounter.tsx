import { Card } from '@/components/ui/card'

interface TaskCounterProps {
  title: string
  value: number
  description: string
}

export function TaskCounter({ title, value, description }: TaskCounterProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Card>
  )
} 