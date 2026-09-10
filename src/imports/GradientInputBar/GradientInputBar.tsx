import svgPaths from "./svg-fz12k9c7dp";
import { imgVector } from "./svg-vrv4s";

function Icon() {
  return (
    <div className="h-[1.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[41.67%_10.71%_58.33%_5.95%]" data-name="Vector">
        <div className="absolute inset-[-0.74px_-6.66%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5866 1.47985">
            <path d="M0.739925 0.739925H11.8467" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.47985" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[1.656px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-0 items-start left-[4.16px] pt-[-0.828px] px-[-0.828px] top-[10px] w-[11.672px]" data-name="Container">
      <Container3 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[13.328px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[5.95%_58.33%_10.71%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-6.66%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.47985 12.5866">
            <path d="M0.739925 0.739925V11.8467" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.47985" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[13.328px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[11.672px] items-start left-[10px] pt-[-0.828px] px-[-0.828px] top-[4.16px] w-0" data-name="Container">
      <Container5 />
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="PlusIcon">
      <Container2 />
      <Container4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <PlusIcon />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-[2px] relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[588_0_0] h-[24px] min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[16px] tracking-[-0.3125px] whitespace-nowrap">Ask me anything</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[3.8%_7.28%_5.3%_5.22%]" data-name="Group">
      <div className="absolute inset-[81.07%_51.03%_5.3%_48.97%]" data-name="Vector">
        <div className="absolute inset-[-27.76%_-0.82px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.64012 4.59432">
            <path d="M0.820061 0.820061V3.77426" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[40.16%_7.28%_18.93%_5.22%]" data-name="Vector">
        <div className="absolute inset-[-9.25%_-5.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.353 10.5027">
            <path d={svgPaths.p2f35bdc0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[3.8%_32.28%_37.11%_30.22%]" data-name="Vector">
        <div className="absolute inset-[-6.41%_-13.95%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.51707 14.4417">
            <path d={svgPaths.p812a200} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[21.664px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col h-[21.664px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[-0.828px] px-[-0.828px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
    </div>
  );
}

function MicrophoneIcon() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="MicrophoneIcon">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pt-px px-[1.492px] relative size-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[3px] relative size-full">
        <MicrophoneIcon />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 px-[10px] rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container7 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[6.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[11.9%_58.33%_16.67%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-15.59%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.48247 6.23693">
            <path d="M0.741233 0.741233V5.49569" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.48247" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[6.656px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5px] items-start left-[3.33px] pt-[-0.828px] px-[-0.828px] top-[7.5px] w-[0.008px]" data-name="Container">
      <Container12 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[11.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[6.94%_58.33%_9.72%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.71%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.49833 11.2118">
            <path d="M0.749164 0.749164V10.4626" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49833" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[11.656px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10px] items-start left-[6.66px] pt-[-0.828px] px-[-0.828px] top-[5px] w-[0.008px]" data-name="Container">
      <Container14 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[4.9%_58.33%_6.86%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-5.11%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50128 16.1979">
            <path d="M0.750639 0.750639V15.4473" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.50128" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col h-[16.656px] items-start relative shrink-0 w-full" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[15px] items-start left-[10px] pt-[-0.828px] px-[-0.828px] top-[2.5px] w-0" data-name="Container">
      <Container16 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[11.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[6.94%_58.33%_9.72%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.71%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.49833 11.2118">
            <path d="M0.749164 0.749164V10.4626" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49833" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[11.656px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10px] items-start left-[13.33px] pt-[-0.828px] px-[-0.828px] top-[5px] w-[0.008px]" data-name="Container">
      <Container18 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[6.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[11.9%_58.33%_16.67%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-15.59%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.48247 6.23693">
            <path d="M0.741233 0.741233V5.49569" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.48247" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[6.656px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5px] items-start left-[16.66px] pt-[-0.828px] px-[-0.828px] top-[7.5px] w-[0.008px]" data-name="Container">
      <Container20 />
    </div>
  );
}

function WaveformIcon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="WaveformIcon">
      <Container11 />
      <Container13 />
      <Container15 />
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <WaveformIcon />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[52px] px-[10px] rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container10 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[40px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function GradientInputBar1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[744px]" data-name="GradientInputBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button />
        <TextInput />
        <Container6 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[68px] relative rounded-[89px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] shrink-0 w-full" data-name="Card">
      <div className="content-stretch flex flex-col items-start px-[20px] py-[14px] relative size-full">
        <GradientInputBar1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[108px] items-start left-0 opacity-70 pl-[20px] pr-[92px] pt-[20px] rounded-[100px] top-0 w-[896px]" style={{ backgroundImage: "linear-gradient(173.127deg, rgb(242, 213, 255) 0%, rgb(213, 229, 255) 50%, rgb(242, 213, 255) 100%)" }} data-name="Container">
      <Card />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[4.55%_4.76%]" data-name="Group">
      <div className="absolute inset-[4.55%_4.76%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-1px] mask-size-[21px_22px]" style={{ maskImage: `url('${imgVector}')` }} data-name="Vector">
        <div className="absolute inset-[-5%_-5.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
            <path d={svgPaths.pefd4400} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function PhoneWithChatIcon() {
  return (
    <div className="content-stretch flex flex-col h-[22px] items-start relative shrink-0 w-full" data-name="PhoneWithChatIcon">
      <Icon8 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[22px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <PhoneWithChatIcon />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[818px] px-[18.5px] rounded-[16777200px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] size-[58px] top-[25px]" data-name="Button">
      <Container21 />
    </div>
  );
}

export default function GradientInputBar() {
  return (
    <div className="relative size-full" data-name="GradientInputBar">
      <Container />
      <Button3 />
    </div>
  );
}