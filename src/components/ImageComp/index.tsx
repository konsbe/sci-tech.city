import Image, { StaticImageData } from "next/image";

interface IProps {
  src: string | StaticImageData;
  height: number;
  width: number;
  alt?: string;
  cardImg?: string;
  onClick?: any;
  pathTo?: string;
}

const ImageComp = (props: IProps): JSX.Element => {
  return (
    <Image
      className={props.cardImg}
      src={props.src}
      alt={props.alt || "img"}
      width={props?.width}
      height={props?.height}
    />
  );
};
export default ImageComp;
