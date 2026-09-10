import svgPaths from "./svg-zfdkqjpprf";
import imgApp from "./80e3ecc7ce4609be5d84cc688bb27dca42c06d4b.png";
import imgImageCompanyLogo from "./5556c1c43ad584ec1a332cff6892548a14930795.png";
import imgImageUserProfile from "./29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import imgImage2 from "./edb1246d01a1ec8786c7023b113393586beb0066.png";

function PlaceholderForApp() {
  return <div className="flex-[1_0_0] min-h-px w-[1387px]" data-name="Placeholder for App" />;
}

function App() {
  return (
    <div className="absolute content-stretch flex flex-col h-[919px] items-start left-0 top-0 w-[1387px]" data-name="App">
      <PlaceholderForApp />
    </div>
  );
}

function App1() {
  return (
    <div className="absolute h-[919px] left-0 top-0 w-[1387px]" data-name="App">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgApp} />
    </div>
  );
}

function ImageCompanyLogo() {
  return (
    <div className="h-[43px] relative shrink-0 w-full" data-name="Image (Company Logo)">
      <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImageCompanyLogo} />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-[43px] items-start relative shrink-0 w-full" data-name="Container">
      <ImageCompanyLogo />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46px] items-start left-[8px] overflow-clip pr-[1118.211px] pt-[-9.5px] top-[8px] w-[1218.211px]" data-name="Button">
      <Container />
    </div>
  );
}

function ImageUserProfile() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[34px]" data-name="Image (User Profile)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[16777200px] size-full" src={imgImageUserProfile} />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[19px] relative shrink-0 w-[38.789px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Roboto:SemiBold',sans-serif] font-semibold leading-[19px] left-[19.5px] text-[#0f0051] text-[14px] text-center top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Log In
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[9999px] shrink-0 w-[70.789px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] py-px relative size-full">
        <Paragraph />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-end justify-center relative size-full">
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[24px] h-[34px] items-center left-[1226.21px] px-[12px] top-[20px] w-[152.789px]" data-name="Container">
      <ImageUserProfile />
      <Container2 />
    </div>
  );
}

function Header() {
  return (
    <div className="h-[62px] relative shrink-0 w-[1387px]" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button />
        <Container1 />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[7.5%]" data-name="Group">
      <div className="absolute inset-[7.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0001 17">
          <path d={svgPaths.p26c32a80} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[8px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute left-[12px] rounded-[12px] size-[36px] top-[16px]" data-name="Button">
      <Container4 />
    </div>
  );
}

function Container5() {
  return <div className="absolute h-[24px] left-[20px] top-[76px] w-[20px]" data-name="Container" />;
}

function Group1() {
  return (
    <div className="absolute contents inset-[7.5%]" data-name="Group">
      <div className="absolute inset-[7.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <path d={svgPaths.p21f3e000} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[8px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute left-[12px] rounded-[12px] size-[36px] top-[124px]" data-name="Button">
      <Container6 />
    </div>
  );
}

function Container7() {
  return <div className="absolute h-[24px] left-[20px] top-[184px] w-[20px]" data-name="Container" />;
}

function Group2() {
  return (
    <div className="absolute contents inset-[7.5%]" data-name="Group">
      <div className="absolute inset-[7.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <path d={svgPaths.padff980} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group2 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[8px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute left-[12px] rounded-[12px] size-[36px] top-[232px]" data-name="Button">
      <Container8 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[5%_5%_5.01%_5%]" data-name="Group">
      <div className="absolute inset-[5%_5%_5.01%_5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9989 17.999">
          <path d={svgPaths.p197ab700} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group3 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[8px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute left-[12px] rounded-[12px] size-[36px] top-[805px]" data-name="Button">
      <Container9 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="h-[857px] relative shrink-0 w-[60px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button2 />
        <Container5 />
        <Button3 />
        <Container7 />
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-0 not-italic text-[15px] text-white top-0 whitespace-nowrap">How can I identify learners ready for the next module?</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-[#902ba2] content-stretch flex flex-col h-[54px] items-start left-0 pt-[16px] px-[20px] rounded-[16px] top-0 w-[423.719px]" data-name="Container">
      <Paragraph1 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[16.5px] left-[367.52px] top-[58px] w-[56.195px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[4px] not-italic text-[#99a1af] text-[11px] top-[0.5px] tracking-[0.0645px] whitespace-nowrap">12:07 PM</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[74.5px] relative shrink-0 w-[423.719px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container16 />
        <Text />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[74.5px] items-start justify-end relative shrink-0 w-full" data-name="Container">
      <Container15 />
    </div>
  );
}

function Container19() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-[16777200px] size-[12px] top-[30px]" data-name="Container" />;
}

function Container18() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(240, 199, 251) 100%)" }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container19 />
        <div className="absolute left-[9.5px] size-[24px] top-[8.5px]" data-name="image 2">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
        </div>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[44px] relative shrink-0 w-[524px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22px] left-[0.5px] not-italic text-[#364153] text-[15px] top-0 w-[503px]">Learners ready for the next module typically demonstrate consistent performance above benchmarks, high engagement with current materials, and strong assessment results…</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[0.5px] rounded-[16px] top-[0.5px] w-[728px]" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[16.5px] left-0 top-[49.5px] w-[56.195px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[4px] not-italic text-[#99a1af] text-[11px] top-[0.5px] tracking-[0.0645px] whitespace-nowrap">12:07 PM</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[98.5px] relative shrink-0 w-[728px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container21 />
        <Text1 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex gap-[12px] h-[98.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container20 />
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[673_0_0] min-h-px relative w-[568px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start overflow-clip relative rounded-[inherit] size-full">
        <Container14 />
        <Container17 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[64px] pt-[40px] px-[40px] relative size-full">
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col h-[803px] items-start left-[-41.5px] rounded-[33px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] top-[14px] w-[638px]" data-name="Container">
      <Container12 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[20.83%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[20.83%] right-[20.83%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 1.66667">
            <path d="M0.833335 0.833335H12.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/2 right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 13.3333">
            <path d="M0.833335 0.833335V12.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group4 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[8px] size-[20px] top-[8px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute border-2 border-[#e5e7eb] border-solid left-0 rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container27 />
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-center left-[52px] overflow-clip top-[8.25px] w-[508px]" data-name="Text Input">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[16px] tracking-[-0.3125px] whitespace-nowrap">Ask me anything</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[8.33%_20.83%]" data-name="Group">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[79.17%]" data-name="Vector">
        <div className="absolute inset-[-33.33%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 4.16667">
            <path d="M0.833335 0.833335V3.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_20.83%_20.83%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 9.16664">
            <path d={svgPaths.p24bef400} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_37.5%_37.5%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-7.69%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66667 12.5">
            <path d={svgPaths.p1417f180} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group5 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10px] size-[20px] top-[10px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container29 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[4.17%_16.67%_-4.17%_16.67%]" data-name="Group">
      <div className="absolute inset-[37.5%_83.33%_29.17%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-12.5%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 8.33337">
            <path d="M0.833335 0.833335V7.50004" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_66.67%_12.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 15">
            <path d="M0.833335 0.833335V14.1667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[-4.17%] left-1/2 right-1/2 top-[4.17%]" data-name="Vector">
        <div className="absolute inset-[-4.17%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 21.6666">
            <path d="M0.833335 0.833335V20.8333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_33.33%_12.5%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 15">
            <path d="M0.833335 0.833335V14.1667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_16.67%_29.17%_83.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66667 8.33337">
            <path d="M0.833335 0.833335V7.50004" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group6 />
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10px] size-[20px] top-[10px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-white left-[52px] rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container30 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[40px] left-[339px] top-0 w-[92px]" data-name="Container">
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[40px] left-[20px] top-[14px] w-[664px]" data-name="Container">
      <Button6 />
      <TextInput />
      <Container28 />
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px relative rounded-[89px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] w-[478px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container26 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col h-[108px] items-start left-0 pl-[20px] pr-[92px] py-[20px] rounded-[100px] top-0 w-[585px]" style={{ backgroundImage: "linear-gradient(171.976deg, rgb(15, 0, 67) 5.1175%, rgb(148, 49, 174) 50%, rgb(22, 0, 88) 94.883%)" }} data-name="Container">
      <Container25 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[9.09%_23.81%]" data-name="Group">
      <div className="absolute inset-[9.09%_23.81%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-9.09%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 20">
            <path d={svgPaths.p2eda2b00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[31.82%] left-1/2 right-[49.95%] top-[68.18%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9009.16%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.0111 2">
            <path d="M1 1H1.0111" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group7 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[22px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[506.5px] px-[18.5px] rounded-[16777200px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] size-[58px] top-[25px]" data-name="Button">
      <Container31 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Button9 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col h-[108px] items-start left-[-52.5px] px-[40px] top-[668px] w-[896px]" data-name="Container">
      <Container23 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[76px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Bakbak_One:Regular',sans-serif] leading-[38px] left-0 not-italic text-[#321863] text-[40px] top-0 w-[529px]">Pet Travel Policy - International Flights</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Last updated Nov 2025</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[104px] relative shrink-0 w-[528.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function ArticleDetailPanel1() {
  return (
    <div className="content-stretch flex h-[104px] items-start justify-between relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <Container33 />
      <Button10 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">Smart Summary</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[22.75px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[#101828] text-[14px] top-px tracking-[-0.1504px] whitespace-nowrap">Complete guide for traveling internationally with pets on Skyline Airways</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[50.75px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#59168b] text-[12px] top-px whitespace-nowrap">6 min read</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[#f3f4f6] h-[24px] relative rounded-[16777200px] shrink-0 w-[84.047px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[12px] relative size-full">
        <Paragraph6 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#59168b] text-[12px] top-px whitespace-nowrap">Pet Travel</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[#f3f4f6] h-[24px] relative rounded-[16777200px] shrink-0 w-[79.883px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[12px] relative size-full">
        <Paragraph7 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function ArticleDetailPanel2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[90.75px] items-start relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-white h-[140.75px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[25px] px-[25px] relative size-full">
        <ArticleDetailPanel2 />
      </div>
    </div>
  );
}

function ArticleDetailPanel3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#4a5565] text-[0px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px] text-[14px]">Effective Date:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` January 1, 2025`}</span>
      </p>
    </div>
  );
}

function ArticleDetailPanel4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#4a5565] text-[0px] top-[0.5px] tracking-[-0.1504px] whitespace-nowrap">
        <span className="leading-[20px] text-[14px]">Applies To:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` All international flights`}</span>
      </p>
    </div>
  );
}

function ArticleDetailPanel5() {
  return (
    <div className="h-[130px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">Traveling internationally can be an exciting adventure, and for many pet owners, the thought of leaving their beloved companions behind is simply out of the question. Thankfully, Skyline Airline understands this bond and offers a comprehensive international pet travel policy designed to ensure a safe and comfortable journey for your furry friends.</p>
    </div>
  );
}

function ArticleDetailPanel6() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[26px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Planning Ahead: Your First Steps</p>
    </div>
  );
}

function ArticleDetailPanel7() {
  return (
    <div className="h-[156px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">{`The key to a smooth international pet travel experience with Skyline Airline begins with meticulous planning. Due to varying regulations and limited space, it's crucial to contact Skyline Airline's dedicated pet travel desk as soon as your travel dates are confirmed. This will allow you to discuss your pet's specific needs, the destination country's import requirements, and secure a reservation for your pet.`}</p>
    </div>
  );
}

function ArticleDetailPanel8() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[26px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">In-Cabin Travel: Small Pets Welcome</p>
    </div>
  );
}

function ArticleDetailPanel9() {
  return (
    <div className="h-[182px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">{`For smaller dogs and cats that meet specific size and weight requirements, Skyline Airline allows them to travel with you in the aircraft cabin. Your pet must remain in an approved carrier that fits comfortably under the seat in front of you for the duration of the flight. The carrier must be well-ventilated, escape-proof, and allow your pet to stand up and turn around naturally. Remember, there's a limit to the number of pets allowed in the cabin per flight, so early booking is essential.`}</p>
    </div>
  );
}

function ArticleDetailPanel10() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[26px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Checked Baggage: Larger Companions</p>
    </div>
  );
}

function ArticleDetailPanel11() {
  return (
    <div className="h-[208px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">{`Larger pets that do not meet the in-cabin requirements can travel safely and comfortably in the climate-controlled cargo hold as checked baggage. Skyline Airline's animal cargo facilities are designed with your pet's well-being in mind, maintaining appropriate temperatures and pressure. It's imperative that your pet's travel kennel meets IATA (International Air Transport Association) regulations for size, construction, and ventilation. Skyline Airline strongly recommends familiarizing your pet with their travel kennel in the weeks leading up to your flight to minimize stress.`}</p>
    </div>
  );
}

function ArticleDetailPanel12() {
  return (
    <div className="h-[26px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[26px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Health and Documentation: Essential Requirements</p>
    </div>
  );
}

function ArticleDetailPanel13() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">International pet travel involves strict health and documentation requirements. You will need to provide:</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[960px] items-start relative shrink-0 w-full" data-name="Container">
      <ArticleDetailPanel5 />
      <ArticleDetailPanel6 />
      <ArticleDetailPanel7 />
      <ArticleDetailPanel8 />
      <ArticleDetailPanel9 />
      <ArticleDetailPanel10 />
      <ArticleDetailPanel11 />
      <ArticleDetailPanel12 />
      <ArticleDetailPanel13 />
    </div>
  );
}

function ArticleDetailPanel14() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[580.5px]" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">{`Key Requirements & Policies`}</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[557px]">Veterinary Health Certificate: Issued by a licensed veterinarian, this certificate confirms your pet is healthy enough for travel and free from contagious diseases. The timing of this certificate is critical, as many countries require it to be issued within a specific window before travel.</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[557px]">Rabies Vaccination Certificate: Proof of current rabies vaccination is almost universally required for international pet travel.</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[557px]">Other Vaccinations: Depending on your destination, additional vaccinations may be necessary.</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[557px]">Import Permits: Some countries require an import permit for pets, which must be obtained in advance.</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="List Item">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[557px]">Microchip: Most countries require pets to be microchipped with an ISO-compliant microchip for identification.</p>
    </div>
  );
}

function ArticleDetailPanel15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[320px] items-start left-[24px] top-[32px] w-[556.5px]" data-name="ArticleDetailPanel">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[352px] relative shrink-0 w-full" data-name="Container">
      <ArticleDetailPanel14 />
      <ArticleDetailPanel15 />
    </div>
  );
}

function ArticleDetailPanel16() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-0 not-italic text-[#59168b] text-[0px] top-[0.5px] tracking-[-0.1504px] w-[547px]">
        <span className="leading-[20px] text-[14px]">Policy Reference:</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px]">{` Skyline Airline's pet travel specialists can guide you through the specific requirements for your destination country, but it is ultimately the pet owner's responsibility to ensure all necessary documentation is in order.`}</span>
      </p>
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[#faf5ff] h-[94px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e9d4ff] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[17px] px-[17px] relative size-full">
        <ArticleDetailPanel16 />
      </div>
    </div>
  );
}

function ArticleDetailPanel17() {
  return (
    <div className="h-[156px] relative shrink-0 w-full" data-name="ArticleDetailPanel">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[26px] left-0 not-italic text-[#101828] text-[16px] top-[-0.5px] tracking-[-0.3125px] w-[581px]">{`At Skyline Airways, your pet's wellbeing is as important to us as yours. Our trained ground handlers and flight crews are committed to providing compassionate care throughout your pet's journey. For questions or to book your pet's travel, please contact our dedicated Pet Travel Support team at 1-800-SKYLINE or visit our website's Pet Travel section. We look forward to welcoming both you and your four-legged family member aboard!`}</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[1682px] items-start relative shrink-0 w-full" data-name="Container">
      <ArticleDetailPanel3 />
      <ArticleDetailPanel4 />
      <Container40 />
      <Container41 />
      <Container42 />
      <ArticleDetailPanel17 />
    </div>
  );
}

function ScrollAreaViewport() {
  return (
    <div className="h-[2038.75px] relative shrink-0 w-full" data-name="ScrollAreaViewport">
      <div className="content-stretch flex flex-col gap-[16px] items-start pt-[40px] px-[32px] relative size-full">
        <ArticleDetailPanel1 />
        <Container34 />
        <Container39 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col h-[814px] items-start overflow-clip relative shrink-0 w-[644.5px]" data-name="Container">
      <ScrollAreaViewport />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[814px] relative rounded-[38px] shrink-0 w-[644.5px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-l border-solid inset-0 pointer-events-none rounded-[38px]" />
    </div>
  );
}

function ArticleDetailPanel() {
  return (
    <div className="absolute bg-white content-stretch flex h-[803px] items-center left-[609.5px] overflow-clip rounded-[38px] shadow-[0px_20px_60px_-15px_rgba(139,92,246,0.25),0px_10px_25px_-10px_rgba(124,58,237,0.15)] top-[14px] w-[644px]" data-name="ArticleDetailPanel">
      <Container32 />
      <Container43 />
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] h-[857px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container11 />
        <Container22 />
        <ArticleDetailPanel />
      </div>
    </div>
  );
}

function ChatScreen() {
  return (
    <div className="flex-[1_0_0] h-[857px] min-w-px relative" data-name="ChatScreen">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[63.5px] relative size-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[857_0_0] min-h-px relative w-[1387px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Sidebar />
        <ChatScreen />
      </div>
    </div>
  );
}

function App2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[919px] items-start left-0 top-0 w-[1387px]" data-name="App">
      <Header />
      <Container3 />
    </div>
  );
}

export default function Pearson() {
  return (
    <div className="bg-white relative size-full" data-name="Pearson">
      <App />
      <App1 />
      <App2 />
    </div>
  );
}