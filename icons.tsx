import type { Icon } from "@/interfaces"

function IconEmail({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.57757 0 0 3.61682 0 8.03093C0 12.411 3.54999 16 7.9384 16C9.42621 16 10.8841 15.5819 12.1457 14.7934L12.3975 14.636L11.6025 13.364L11.3507 13.5214C10.3275 14.1609 9.14508 14.5 7.9384 14.5C4.38672 14.5 1.5 11.5909 1.5 8.03093C1.5 4.43692 4.4143 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8V8.60714C14.5 9.3764 13.8764 10 13.1071 10C12.2195 10 11.5 9.28046 11.5 8.39286V8V4.5H10V5.12734C9.43308 4.73191 8.74362 4.5 8 4.5C6.067 4.5 4.5 6.067 4.5 8C4.5 9.933 6.067 11.5 8 11.5C9.05713 11.5 10.0048 11.0313 10.6466 10.2904C11.2148 11.0262 12.1056 11.5 13.1071 11.5C14.7048 11.5 16 10.2048 16 8.60714V8C16 3.58172 12.4183 0 8 0ZM10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10C9.10457 10 10 9.10457 10 8Z" fill={color}/>
    </svg>
  )
}

function IconLoader({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <div className="w-full flex items-center justify-center">
      <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size} className="animate-spin">
        <g clipPath="url(#clip0_2393_1490)">
          <path d="M8 0V4" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.5" d="M8 16V12" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.9" d="M3.29773 1.52783L5.64887 4.7639" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.1" d="M12.7023 1.52783L10.3511 4.7639" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.4" d="M12.7023 14.472L10.3511 11.236" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.6" d="M3.29773 14.472L5.64887 11.236" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.2" d="M15.6085 5.52783L11.8043 6.7639" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.7" d="M0.391602 10.472L4.19583 9.23598" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.3" d="M15.6085 10.4722L11.8043 9.2361" stroke={color} strokeWidth="1.5"/>
          <path opacity="0.8" d="M0.391602 5.52783L4.19583 6.7639" stroke={color} strokeWidth="1.5"/>
        </g>
        <defs>
          <clipPath id="clip0_2393_1490">
            <rect width="16" height="16" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

function IconEye({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z" fill={color}/>
    </svg>
  )
}

function IconEyeOff({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z" fill={color}/>
    </svg>
  )
}

function IconChart({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M14 1V1.75V14.25V15H12.5V14.25V1.75V1H14ZM8.75 6V6.75V14.25V15H7.25V14.25V6.75V6H8.75ZM3.5 10.75V10H2V10.75V14.25V15H3.5V14.25V10.75Z" fill={color}/>
    </svg>
  )
}

function IconFingerPrint({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <g clipPath="url(#clip0_4628_1818)">
        <path fillRule="evenodd" clipRule="evenodd" d="M15.0932 7.64904C14.8377 3.56123 11.3168 0.454519 7.22898 0.710006C5.45234 0.821046 3.8593 1.54996 2.64882 2.67365L3.66933 3.77299C4.63533 2.87625 5.90403 2.29574 7.32254 2.20709C10.5835 2.00327 13.3923 4.48161 13.5961 7.74261C13.663 8.81244 14.0605 10.1035 15.1336 10.8299L15.9745 9.58773C15.4544 9.23567 15.1467 8.50463 15.0932 7.64904ZM1.21934 4.48945C0.544864 5.69225 0.197633 7.09732 0.28994 8.57425C0.414316 10.5643 0.700415 12.5343 1.14241 14.4655L2.6046 14.1308C2.1807 12.2786 1.90631 10.3893 1.78702 8.48068C1.71326 7.30048 1.99016 6.18167 2.52767 5.22312L1.21934 4.48945ZM11.9314 8.14996C11.7883 5.86143 9.81714 4.12215 7.5286 4.26518C5.24007 4.40822 3.50079 6.3794 3.64382 8.66793C3.6894 9.3971 3.75974 10.1232 3.85448 10.845L5.34173 10.6498C5.25141 9.9617 5.18435 9.2695 5.1409 8.57437C5.04955 7.11264 6.16045 5.85362 7.62217 5.76226C9.0839 5.67091 10.3429 6.78181 10.4343 8.24353C10.4726 8.85698 10.5332 9.46767 10.6157 10.0745L12.102 9.87246C12.0244 9.30161 11.9674 8.72708 11.9314 8.14996ZM13.0024 13.8749C12.7538 13.0919 12.5457 12.2962 12.379 11.4908L10.9101 11.7947C11.0749 12.5911 11.2779 13.3786 11.5181 14.1546L13.0024 13.8749ZM14.6499 24.8207L10.8508 25.5691C11.9295 25.8912 13.1347 25.7761 14.176 25.1513C14.3437 25.0507 14.5018 24.94 14.6499 24.8207ZM4.79771 15.421C4.62667 14.8172 4.47329 14.2083 4.33781 13.5951C4.27053 13.2906 4.20767 12.985 4.14924 12.6784L5.62272 12.3976C5.67842 12.6899 5.73835 12.9812 5.80249 13.2715C5.94137 13.9001 6.09998 14.5239 6.27803 15.142L4.79771 15.421ZM8.11677 14.7955L8.0783 14.6651L8.0775 14.6624C7.46325 12.5503 7.08106 10.3695 6.94287 8.1585C6.91703 7.7451 7.23122 7.38902 7.64463 7.36318C8.05803 7.33734 8.41411 7.65153 8.43995 8.06494C8.57119 10.1649 8.93413 12.2361 9.51744 14.2421L9.51783 14.2435L9.5983 14.5164L8.11677 14.7955Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="clip0_4628_1818">
          <rect width={size} height={size} fill="white" style={{ fill: "white", fillOpacity: 1 }}/>
        </clipPath>
      </defs>
  </svg>
  )
}

function IconGeneration({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5713 1.06055C11.7428 -0.110799 13.6419 -0.110799 14.8135 1.06055C15.985 2.23212 15.985 4.13214 14.8135 5.30371L7.47949 12.6357C7.28634 14.5255 5.6908 16 3.75 16H0V12.25C1.43257e-07 10.4118 1.3228 8.88311 3.06836 8.5625L10.5713 1.06055ZM14.25 11.75C14.25 12.3023 14.6977 12.75 15.25 12.75H16V14.25H15.25C14.6977 14.25 14.25 14.6977 14.25 15.25V16H12.75V15.25C12.75 14.6977 12.3023 14.25 11.75 14.25H11V12.75H11.75C12.3023 12.75 12.75 12.3023 12.75 11.75V11H14.25V11.75ZM3.29297 10.0459C2.26941 10.257 1.5 11.1639 1.5 12.25V14.5H3.75C4.83635 14.5 5.74227 13.73 5.95312 12.7061L3.29297 10.0459ZM4.56055 9.19238L6.68164 11.3135L7.9668 10.0273L5.8457 7.90625L4.56055 9.19238ZM13.7529 2.12109C13.1672 1.53553 12.2176 1.53553 11.6318 2.12109L6.90625 6.8457L9.02734 8.9668L13.7529 4.24219C14.3385 3.65639 14.3387 2.70682 13.7529 2.12109ZM3.25 0V0.75C3.25 1.30228 3.69772 1.75 4.25 1.75H5V3.25H4.25C3.69772 3.25 3.25 3.69772 3.25 4.25V5H1.75V4.25C1.75 3.69772 1.30228 3.25 0.75 3.25H0V1.75H0.75C1.30228 1.75 1.75 1.30228 1.75 0.75V0H3.25Z" fill={color}/>
    </svg>
  )
}

function IconMenuArrow({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg width={size} height={size/2} viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "rotate(180deg)" }}>
      <g clipPath="url(#heks8)">
        <path d="M15 -0.5V0.5H12.9834L12.8184 0.508789C12.4377 0.550822 12.0853 0.738056 11.8359 1.03418L8.53027 4.95996C7.73114 5.90893 6.26886 5.90892 5.46973 4.95996L2.16406 1.03418C1.87905 0.695733 1.45907 0.5 1.0166 0.5H-1V-0.5H15Z" fill={color} stroke="#e5e7eb"/>
      </g>
      <defs>
        <clipPath id="clip0_11069_2571">
          <rect width={size} height={size/2} fill={color}/>
        </clipPath>
      </defs>
    </svg>
  )
}

function IconLogout({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.5 13.5H6.75V15H2C1.44772 15 1 14.5523 1 14V2C1 1.44771 1.44772 1 2 1H6.75V2.5L2.5 2.5L2.5 13.5ZM12.4393 7.24999L10.4697 5.28031L9.93934 4.74998L11 3.68932L11.5303 4.21965L14.6036 7.29288C14.9941 7.6834 14.9941 8.31657 14.6036 8.70709L11.5303 11.7803L11 12.3106L9.93934 11.25L10.4697 10.7197L12.4393 8.74999L5.75 8.74999H5V7.24999H5.75L12.4393 7.24999Z" fill={color}/>
    </svg>
  )
}

function IconMenu({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 2H9.75H14.25H15V3.5H14.25H9.75H9V2ZM9 12.5H9.75H14.25H15V14H14.25H9.75H9V12.5ZM9.75 7.25H9V8.75H9.75H14.25H15V7.25H14.25H9.75ZM1 12.5H1.75H2.25H3V14H2.25H1.75H1V12.5ZM1.75 2H1V3.5H1.75H2.25H3V2H2.25H1.75ZM1 7.25H1.75H2.25H3V8.75H2.25H1.75H1V7.25ZM5.75 12.5H5V14H5.75H6.25H7V12.5H6.25H5.75ZM5 2H5.75H6.25H7V3.5H6.25H5.75H5V2ZM5.75 7.25H5V8.75H5.75H6.25H7V7.25H6.25H5.75Z" fill={color}/>
    </svg>
  )
}

function IconChevronRightSmall({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.74999 3.93933L7.28032 4.46966L10.1035 7.29288C10.4941 7.68341 10.4941 8.31657 10.1035 8.7071L7.28032 11.5303L6.74999 12.0607L5.68933 11L6.21966 10.4697L8.68933 7.99999L6.21966 5.53032L5.68933 4.99999L6.74999 3.93933Z" fill={color}/>
    </svg>
  )
}

function IconCross({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z" fill={color} strokeWidth="1.5" stroke={color}/>
    </svg>
  )
}

function IconSmallTimer({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5"/>
      <path d="M8 4.5V8L10.5 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconSmallPerson({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" stroke={color} strokeWidth="1.5"/>
      <path d="M2 14C2 11.2386 4.68629 9 8 9C11.3137 9 14 11.2386 14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconSchool({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1L1 5.5L8 10L15 5.5L8 1Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M3 7V12L8 15L13 12V7" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

function IconRotateCounterClockwise({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M13.5 8C13.5 4.96643 11.0257 2.5 7.96452 2.5C5.42843 2.5 3.29365 4.19393 2.63724 6.5H5.25H6V8H5.25H0.75C0.335787 8 0 7.66421 0 7.25V2.75V2H1.5V2.75V5.23347C2.57851 2.74164 5.06835 1 7.96452 1C11.8461 1 15 4.13001 15 8C15 11.87 11.8461 15 7.96452 15C5.62368 15 3.54872 13.8617 2.27046 12.1122L1.828 11.5066L3.03915 10.6217L3.48161 11.2273C4.48831 12.6051 6.12055 13.5 7.96452 13.5C11.0257 13.5 13.5 11.0336 13.5 8Z" fill={color}/>
    </svg>
  )
}

function IconStar({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00001 0.433594L8.65845 1.64093L10.5908 5.18412L14.5577 5.92698L15.9094 6.18011L14.9646 7.17942L12.192 10.1121L12.7113 14.1144L12.8883 15.4782L11.6459 14.8884L8.00001 13.1577L4.35408 14.8884L3.11173 15.4782L3.28869 14.1144L3.80802 10.1121L1.03538 7.17942L0.0906067 6.18011L1.44233 5.92698L5.40922 5.18412L7.34156 1.64093L8.00001 0.433594ZM8.00001 3.56646L6.55565 6.21487L6.38519 6.52743L6.03525 6.59296L3.07014 7.14822L5.14259 9.34029L5.38718 9.59899L5.34137 9.95205L4.95318 12.9436L7.67838 11.65L8.00001 11.4973L8.32163 11.65L11.0468 12.9436L10.6586 9.95205L10.6128 9.59899L10.8574 9.34029L12.9299 7.14822L9.96476 6.59296L9.61482 6.52743L9.44436 6.21487L8.00001 3.56646Z" fill={color}/>
    </svg>
  )
}

function IconStarFill({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.99999 0.489502L10.5734 5.20807L15.8562 6.19736L12.1638 10.1029L12.8554 15.4329L7.99999 13.1281L3.1446 15.4329L3.83621 10.1029L0.143799 6.19736L5.42663 5.20807L7.99999 0.489502Z" fill={color}/>
    </svg>
  )
}

function IconWarning({
  size = 16,
  color = "currentColor"
}: Icon): React.JSX.Element {
  return (
    <svg height={size} strokeLinejoin="round" viewBox="0 0 16 16" width={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.55846 2H7.44148L1.88975 13.5H14.1102L8.55846 2ZM9.90929 1.34788C9.65902 0.829456 9.13413 0.5 8.55846 0.5H7.44148C6.86581 0.5 6.34092 0.829454 6.09065 1.34787L0.192608 13.5653C-0.127943 14.2293 0.355835 15 1.09316 15H14.9068C15.6441 15 16.1279 14.2293 15.8073 13.5653L9.90929 1.34788ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z" fill={color}/>
    </svg>
  )
}

export {
  IconEmail,
  IconLoader,
  IconEye,
  IconEyeOff,
  IconChart,
  IconFingerPrint,
  IconGeneration,
  IconMenuArrow,
  IconLogout,
  IconMenu,
  IconChevronRightSmall,
  IconCross,
  IconSmallTimer,
  IconSmallPerson,
  IconSchool,
  IconRotateCounterClockwise,
  IconStar,
  IconStarFill,
  IconWarning
}