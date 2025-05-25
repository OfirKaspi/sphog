interface BaseEntity {
  _id: string;
}

interface Paragraph extends BaseEntity {
  header: string;
  desc: string;
}

export interface LinkType {
  text: string;
  href: string;
}

export interface Image {
  alt: string;
  src: string;
}

// interface Background extends BaseEntity {
//   image: Image
//   color: string;
// }

// interface Link extends BaseEntity {
//   text: string
//   href: string
// }


export interface ImageSectionType extends Image, Paragraph {
  buttonText?: string; // Optional field for button text
}

export interface Product {
  _id: number;
  name: string;
  price: number;
  image: Image
  description: string;
  isInStock: boolean; 
}

export interface Mission {
  title: string
  subtitle?: string
  points: string[]
}

export interface Value {
  icon?: string // optional path to icon
  title: string
  description: string
}

export interface Testimonial {
  name: string
  quote: string
  role?: string
  image?: Image
}

export interface Tip {
  _id: number
  title: string
  description: string
  image: {
    src: string
    alt: string
  }
}

export interface WorkshopData {
  title: string;
  description: string;
  image: Image;
  link: LinkType;
}

