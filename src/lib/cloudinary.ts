import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";

import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { format, quality, dpr } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";

import { CLOUDINARY_CLOUD_NAME } from "@/constants";

// Cloudinary instance.
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

export const bannerPhoto = (imageCldPubId: string, name: string) => {
  return (
    cld
      .image(imageCldPubId)

      .resize(
        fill().width(1200).height(297) // Aspect ratio 5:1
      )
      // Optimize for web
      .delivery(format("auto"))
      .delivery(quality("auto"))
      .delivery(dpr("auto"))
      // Text overlay with name
      .overlay(
        source(
          text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
            "white"
          )
        ).position(
          new Position()
            .gravity(compass("south_west"))
            .offsetY(0.2)
            .offsetX(0.02)
        )
      )
  );
};
