import Image from 'next/image'

export function RemoraLogo({ className, width = 120, height = 40 }: { className?: string; width?: number; height?: number }) {
  return (
    <div className={className}>
      <Image
        src="/images/logo.png"
        alt="Remora Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  )
}
