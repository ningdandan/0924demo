import svgPaths from "./svg-61mosk9nga";

function Container2() {
  return (
    <div className="flex-[265.164_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Files Downloaded</p>
      </div>
    </div>
  );
}

function StatusBadge() {
  return (
    <div className="bg-[rgba(0,188,125,0.15)] h-[19px] relative rounded-[16777200px] shrink-0 w-[72.836px]" data-name="StatusBadge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[8px] not-italic text-[#096] text-[10px] top-[2.5px] tracking-[0.3672px] uppercase whitespace-nowrap">Complete</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[52px] relative shrink-0 w-[390px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[12px] pt-[16px] px-[20px] relative size-full">
        <Container2 />
        <StatusBadge />
      </div>
    </div>
  );
}

function Container3() {
  return <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-[390px]" data-name="Container" />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_60_81)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17134c00} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_60_81">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[230.797px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#096] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">6 receipts downloaded successfully</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(0,188,125,0.1)] h-[36px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <Icon />
          <Text />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#717182] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">All files have been saved to your Downloads folder.</p>
    </div>
  );
}

function CardAnatomy() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="CardAnatomy">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[390px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] px-[20px] relative size-full">
        <CardAnatomy />
      </div>
    </div>
  );
}

function Container7() {
  return <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-[390px]" data-name="Container" />;
}

function Button() {
  return (
    <div className="bg-white flex-[171_0_0] h-[36px] min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[85.8px] not-italic text-[#0a0a0a] text-[14px] text-center top-[8.5px] tracking-[-0.1504px] whitespace-nowrap">Undo</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#030213] flex-[171_0_0] h-[36px] min-w-px relative rounded-[8px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[86.48px] not-italic text-[14px] text-center text-white top-[8.5px] tracking-[-0.1504px] whitespace-nowrap">Open Folder</p>
      </div>
    </div>
  );
}

function CardActions() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="CardActions">
      <Button />
      <Container9 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[60px] relative shrink-0 w-[390px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[12px] px-[20px] relative size-full">
        <CardActions />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[28.5px] relative shrink-0 w-[390px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[20px] not-italic text-[#717182] text-[11px] top-[0.5px] tracking-[0.0645px] whitespace-nowrap">Just now</p>
      </div>
    </div>
  );
}

function DynamicCard() {
  return (
    <div className="content-stretch flex flex-col h-[238.5px] items-start relative shrink-0 w-full" data-name="DynamicCard">
      <Container1 />
      <Container3 />
      <Container4 />
      <Container7 />
      <Container8 />
      <Container10 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white relative rounded-[14px] size-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <DynamicCard />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,125,0.4)] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}