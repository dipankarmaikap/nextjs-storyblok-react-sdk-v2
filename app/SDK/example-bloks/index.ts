/**
 * Example bloks index - exports all bloks and the components map
 */

// Server components
export { PageBlok } from "./page-blok";
export { FeatureBlok } from "./feature-blok";
export { ProductListBlok } from "./product-list-blok";

// Client components
export { AccordionBlok } from "./accordion-blok";
export { TabsBlok } from "./tabs-blok";

// Components map for use with StoryblokServerComponent
import type { ComponentsMap } from "../types";
import { PageBlok } from "./page-blok";
import { FeatureBlok } from "./feature-blok";
import { ProductListBlok } from "./product-list-blok";
import { AccordionBlok } from "./accordion-blok";
import { TabsBlok } from "./tabs-blok";

export const exampleComponents: ComponentsMap = {
  page: PageBlok,
  feature: FeatureBlok,
  product_list: ProductListBlok,
  accordion: AccordionBlok,
  tabs: TabsBlok,
};
