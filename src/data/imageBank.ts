// Shared image URLs for product cards / image sheets. Sourced from
// Wikimedia Commons (CDN, no hotlink protection). Keys are category-loose
// (e.g. "sunflowerOil" covers any sunflower-oil SKU). The generated SKU set
// in generatedProducts.ts maps each category to the closest bank entry.

export const IMG: Record<string, string[]> = {
  sunflowerOil: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Bottle_1_liter_Sunflower_refined_oil.jpg/500px-Bottle_1_liter_Sunflower_refined_oil.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sunflower_oil.jpg/500px-Sunflower_oil.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_oil_bottles_in_Dnipro.jpg/500px-Sunflower_oil_bottles_in_Dnipro.jpg',
  ],
  groundnutOil: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Groundnut_Oil.jpg/500px-Groundnut_Oil.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/ILUAMUTHU_GROUNDNUT_OIL.jpg/500px-ILUAMUTHU_GROUNDNUT_OIL.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Fried_oil_or_peanut_oil_Oil_from_frying_chicken_or_fish.jpg/500px-Fried_oil_or_peanut_oil_Oil_from_frying_chicken_or_fish.jpg',
  ],
  soyaOil: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Soybean_Oil_%2810059657806%29.jpg/500px-Soybean_Oil_%2810059657806%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/7/77/AWL_Agri_Business.jpg',
  ],
  atta: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Atta_flour.jpg/500px-Atta_flour.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Chapaticooking.jpg/500px-Chapaticooking.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Tandoor_roti.jpg/500px-Tandoor_roti.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Puri.jpg/500px-Puri.jpg',
  ],
  ghee: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Home_made_Ghee.jpg/500px-Home_made_Ghee.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Desi_ghee.JPG/500px-Desi_ghee.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Cream_to_get_clarified_butter_home_made.Ghee.jpg/500px-Cream_to_get_clarified_butter_home_made.Ghee.jpg',
  ],
  detergent: [
    'https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Surf_Excel.svg/500px-Surf_Excel.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Detergent_powder_with_laundry_enzymes.jpg/500px-Detergent_powder_with_laundry_enzymes.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Laundry_detergent_1.jpg/500px-Laundry_detergent_1.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Plastic_spoon_n_Laundry_detergent_n_Washing_powder_in_white.jpg/500px-Plastic_spoon_n_Laundry_detergent_n_Washing_powder_in_white.jpg',
  ],
  salt: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Iodized_salt_packet.jpg/500px-Iodized_salt_packet.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Iodised_salt.JPG/500px-Iodised_salt.JPG',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/TATA-CONSUMER-PRODUCTS_BLUE_LOGO_Feb_13.png/500px-TATA-CONSUMER-PRODUCTS_BLUE_LOGO_Feb_13.png',
  ],
  maggi: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Maggi_logo.svg/500px-Maggi_logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Maggi_with_Tea_flavored_Milk.jpg/500px-Maggi_with_Tea_flavored_Milk.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Br%C3%BChw%C3%BCrfel-1.jpg/500px-Br%C3%BChw%C3%BCrfel-1.jpg',
  ],
  parleg: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Parle_G_logo.jpg/500px-Parle_G_logo.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Parle_Gluco_ad_1947.jpg/500px-Parle_Gluco_ad_1947.jpg',
  ],
  butter: [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Home_made_Ghee.jpg/500px-Home_made_Ghee.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Desi_ghee.JPG/500px-Desi_ghee.JPG',
  ],
};
