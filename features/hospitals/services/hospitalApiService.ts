import { BANGLADESH_LOCATIONS } from "@/lib/utils/bangladeshLocations";
import { HospitalPlace, NominatimRawResult } from "../types/hospital.types";

export const FEATURED_BLOOD_BANKS: HospitalPlace[] = [
  {
    id: "bb-quantum",
    name: "Quantum Foundation Blood Lab",
    displayName: "Quantum Foundation Blood Lab, Shantinagar, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    area: "Motijheel",
    address: "31/V Shilpacharya Zainul Abedin Sarak, Shantinagar, Dhaka-1217",
    latitude: 23.7388,
    longitude: 90.4144,
    isBloodBank: true,
    phone: "+88029351484",
    type: "blood_bank",
  },
  {
    id: "bb-red-crescent",
    name: "Bangladesh Red Crescent Blood Center",
    displayName:
      "Bangladesh Red Crescent National Blood Center, Mohakhali, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    area: "Mohakhali",
    address: "7/5 Aurangzeb Road, Mohammadpur / Mohakhali, Dhaka",
    latitude: 23.7788,
    longitude: 90.4024,
    isBloodBank: true,
    phone: "+88029352226",
    type: "blood_bank",
  },
  {
    id: "bb-badhan-central",
    name: "Badhan Central Blood Bank",
    displayName: "Badhan (Transfusion Volunteer Org), TSC, Dhaka University",
    division: "Dhaka",
    district: "Dhaka",
    area: "Shahbagh",
    address: "Teacher-Student Centre (TSC), Dhaka University Campus, Dhaka",
    latitude: 23.7317,
    longitude: 90.3957,
    isBloodBank: true,
    phone: "+8801534982674",
    type: "blood_bank",
  },
  {
    id: "bb-dmch",
    name: "Dhaka Medical College Hospital Blood Bank",
    displayName:
      "Dhaka Medical College Hospital Transfusion Unit, Bakshibazar, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    area: "Old Dhaka",
    address: "Secretariat Road, Bakshibazar, Dhaka-1000",
    latitude: 23.7258,
    longitude: 90.3976,
    isBloodBank: true,
    phone: "+880255165088",
    type: "hospital",
  },
  {
    id: "bb-square",
    name: "Square Hospital Blood Bank",
    displayName: "Square Hospital Transfusion Center, Panthapath, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    area: "Dhanmondi",
    address: "18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka-1205",
    latitude: 23.753,
    longitude: 90.3817,
    isBloodBank: true,
    phone: "+8801713377775",
    type: "hospital",
  },
  {
    id: "bb-cmch",
    name: "Chittagong Medical College Hospital Blood Bank",
    displayName:
      "Chittagong Medical College Hospital, KB Fazlul Kader Road, Chattogram",
    division: "Chattogram",
    district: "Chattogram",
    area: "Panchlaish",
    address: "57 KB Fazlul Kader Road, Panchlaish, Chattogram",
    latitude: 22.3592,
    longitude: 91.8315,
    isBloodBank: true,
    phone: "+88031616422",
    type: "hospital",
  },
  {
    id: "bb-rmch",
    name: "Rajshahi Medical College Hospital Blood Bank",
    displayName: "Rajshahi Medical College Hospital, Laxmipur, Rajshahi",
    division: "Rajshahi",
    district: "Rajshahi",
    area: "Rajshahi Sadar",
    address: "Medical College Road, Laxmipur, Rajshahi-6000",
    latitude: 24.3734,
    longitude: 88.5831,
    isBloodBank: true,
    phone: "+880721772150",
    type: "hospital",
  },
  {
    id: "bb-somc",
    name: "Sylhet MAG Osmani Medical College Hospital",
    displayName:
      "Sylhet MAG Osmani Medical College Hospital, Medical Road, Sylhet",
    division: "Sylhet",
    district: "Sylhet",
    area: "Sylhet Sadar",
    address: "Medical Road, Kajolshah, Sylhet-3100",
    latitude: 24.8998,
    longitude: 91.8542,
    isBloodBank: true,
    phone: "+880821713088",
    type: "hospital",
  },
  {
    id: "bb-kmch",
    name: "Khulna Medical College Hospital Blood Bank",
    displayName:
      "Khulna Medical College Hospital Transfusion Unit, Boyra, Khulna",
    division: "Khulna",
    district: "Khulna",
    area: "Khulna Sadar",
    address: "Boyra Main Road, Boyra, Khulna-9000",
    latitude: 22.8456,
    longitude: 89.5403,
    isBloodBank: true,
    phone: "+88041760350",
    type: "hospital",
  },
  {
    id: "bb-sbmch",
    name: "Sher-e-Bangla Medical College Hospital Blood Bank",
    displayName: "Sher-e-Bangla Medical College Hospital, Band Road, Barishal",
    division: "Barishal",
    district: "Barishal",
    area: "Barishal Sadar",
    address: "Band Road, Alekanda, Barishal-8200",
    latitude: 22.6876,
    longitude: 90.3582,
    isBloodBank: true,
    phone: "+880431217354",
    type: "hospital",
  },
  {
    id: "bb-rpmch",
    name: "Rangpur Medical College Hospital Blood Bank",
    displayName:
      "Rangpur Medical College Hospital Transfusion Unit, Dhap, Rangpur",
    division: "Rangpur",
    district: "Rangpur",
    area: "Rangpur Sadar",
    address: "Medical East Gate, Dhap, Rangpur-5400",
    latitude: 25.7601,
    longitude: 89.2372,
    isBloodBank: true,
    phone: "+88052162235",
    type: "hospital",
  },
  {
    id: "bb-mmch",
    name: "Mymensingh Medical College Hospital Blood Bank",
    displayName:
      "Mymensingh Medical College Hospital Transfusion Unit, Charpara",
    division: "Mymensingh",
    district: "Mymensingh",
    area: "Mymensingh Sadar",
    address: "Medical College Road, Charpara, Mymensingh-2200",
    latitude: 24.7431,
    longitude: 90.4125,
    isBloodBank: true,
    phone: "+8809166063",
    type: "hospital",
  },
];

function matchDivisionAndDistrict(
  rawDivision: string,
  rawDistrict: string,
  rawArea: string,
) {
  let matchedDivision = "Dhaka";
  const divisionKeys = Object.keys(BANGLADESH_LOCATIONS);
  for (const div of divisionKeys) {
    if (
      rawDivision.toLowerCase().includes(div.toLowerCase()) ||
      rawDistrict.toLowerCase().includes(div.toLowerCase()) ||
      (div === "Chattogram" &&
        (rawDivision.toLowerCase().includes("chittagong") ||
          rawDistrict.toLowerCase().includes("chittagong")))
    ) {
      matchedDivision = div;
      break;
    }
  }

  const districtKeys = Object.keys(BANGLADESH_LOCATIONS[matchedDivision] || {});
  let matchedDistrict = districtKeys[0] || "Dhaka";
  for (const dist of districtKeys) {
    if (
      rawDistrict.toLowerCase().includes(dist.toLowerCase()) ||
      rawDivision.toLowerCase().includes(dist.toLowerCase()) ||
      rawArea.toLowerCase().includes(dist.toLowerCase())
    ) {
      matchedDistrict = dist;
      break;
    }
  }

  const areas = BANGLADESH_LOCATIONS[matchedDivision]?.[matchedDistrict] || [];
  let matchedArea = areas[0] || "Sadar";
  for (const a of areas) {
    if (rawArea.toLowerCase().includes(a.toLowerCase())) {
      matchedArea = a;
      break;
    }
  }

  return {
    division: matchedDivision,
    district: matchedDistrict,
    area: matchedArea,
  };
}

export const hospitalApiService = {
  /**
   * Search hospitals & clinics in Bangladesh using the OpenStreetMap Nominatim REST API
   */
  async searchHospitals(
    query: string,
    filterDivision?: string,
  ): Promise<HospitalPlace[]> {
    const isAllDivision =
      !filterDivision || filterDivision.toLowerCase() === "all";
    const trimmed = query.trim();

    // 1. Search locally matched featured blood banks
    const localMatches = FEATURED_BLOOD_BANKS.filter((item) => {
      const q = trimmed.toLowerCase();
      const matchesText =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q);
      const matchesDiv =
        isAllDivision ||
        item.division.toLowerCase() === filterDivision.toLowerCase();
      return matchesText && matchesDiv;
    });

    // If query is empty and user wants "All", return curated institutions directly
    if (!trimmed && isAllDivision) {
      return localMatches;
    }

    try {
      // 2. Query Nominatim REST API with Bangladesh bounding & country filter
      let searchQuery = "";
      if (trimmed) {
        searchQuery =
          trimmed.toLowerCase().includes("hospital") ||
          trimmed.toLowerCase().includes("clinic") ||
          trimmed.toLowerCase().includes("medical")
            ? trimmed
            : `${trimmed} hospital`;
        if (!isAllDivision) {
          searchQuery = `${searchQuery} ${filterDivision}`;
        }
      } else if (!isAllDivision) {
        searchQuery = `hospital ${filterDivision}`;
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery,
      )}&format=json&countrycodes=bd&addressdetails=1&limit=10`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "RoktoSheba-App/1.0 (academic-blood-donation-project; contact: roktosheba@support.bd)",
        },
      });

      if (!response.ok) {
        console.warn("[HospitalAPI] Nominatim error status:", response.status);
        return localMatches;
      }

      const results: NominatimRawResult[] = await response.json();

      const apiPlaces: HospitalPlace[] = results.map((item) => {
        const addr = item.address || {};
        const rawDiv = addr.state || "";
        const rawDist = addr.state_district || addr.city || addr.town || "";
        const rawArea =
          addr.suburb ||
          addr.neighbourhood ||
          addr.city_district ||
          addr.road ||
          "";

        const locationMatch = matchDivisionAndDistrict(
          rawDiv,
          rawDist,
          rawArea,
        );

        // Derive short clean name
        const cleanName =
          addr.hospital ||
          addr.clinic ||
          addr.amenity ||
          item.display_name.split(",")[0].trim();

        return {
          id: `osm-${item.place_id}`,
          name: cleanName,
          displayName: item.display_name,
          division: locationMatch.division,
          district: locationMatch.district,
          area: locationMatch.area,
          address: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          isBloodBank:
            item.type === "blood_bank" ||
            item.display_name.toLowerCase().includes("blood"),
          type: item.type || "hospital",
        };
      });

      // Filter by division if specified
      const filteredApi = filterDivision
        ? apiPlaces.filter(
            (p) => p.division.toLowerCase() === filterDivision.toLowerCase(),
          )
        : apiPlaces;

      // Merge: unique by name
      const seen = new Set<string>();
      const combined: HospitalPlace[] = [];

      for (const item of [...localMatches, ...filteredApi]) {
        const normalized = item.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!seen.has(normalized)) {
          seen.add(normalized);
          combined.push(item);
        }
      }

      return combined.length > 0 ? combined : localMatches;
    } catch (err) {
      console.warn(
        "[HospitalAPI] Fetch failed, falling back to curated list:",
        err,
      );
      return localMatches;
    }
  },

  /**
   * Get featured emergency blood banks and transfusion centers
   */
  getFeaturedBloodBanks(filterDivision?: string): HospitalPlace[] {
    if (!filterDivision) {
      return FEATURED_BLOOD_BANKS;
    }
    return FEATURED_BLOOD_BANKS.filter(
      (b) => b.division.toLowerCase() === filterDivision.toLowerCase(),
    );
  },
};
