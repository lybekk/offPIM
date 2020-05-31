<template lang="pug">
    v-row
        v-col(cols="12")
            h4 Address
            v-text-field(
                label="Street address"
                :value="address.streetAddress"
                filled
                @change="setAddress('streetAddress',$event)"
            )
            //- TODO: Evaluate bringing this in, postOfficeBoxNumber
            v-text-field(
                label="Locality"
                :value="address.addressLocality"
                hint="I.E. Mountain View"
                filled
                @change="setAddress('addressLocality',$event)"
            )
            v-text-field(
                label="Postal code"
                :value="address.postalCode"
                hint="I.E. Zip code"
                filled
                @change="setAddress('postalCode',$event)"
            )
            v-text-field(
                label="Region"
                :value="address.addressRegion"
                hint="I.E. New York"
                filled
                @change="setAddress('addressRegion',$event)"
            )
            v-text-field(
                label="Country"
                :value="address.addressCountry"
                filled
                @change="setAddress('addressCountry',$event)"
            )
            div(v-if="doc['@type'] == 'Organization'")
                h5 Geo-coordinates
                v-text-field(
                    label="Latitude"
                    :value="doc.location.geo.latitude"
                    filled
                    @change="setGeo('latitude',$event)"
                )
                v-text-field(
                    label="Longitude"
                    :value="doc.location.geo.longitude"
                    filled
                    @change="setGeo('longitude',$event)"
                )
</template>

<script>
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "contactsitemdetailedlocations",
  mixins: [pouchMixin, itemDetailedMixin],
  computed: {
    address() {
      if (!this.doc.address) {
        return {};
      }
      return this.doc.address;
    }
  },
  methods: {
    setAddress: function(key, value) {
      let d = this.doc;
      if (typeof d.address == "string") {
        d.address = { streetAddress: d.address };
      }
      if (!d.address) {
        d.address = {};
      }
      d.address[key] = value;
      this.setDocField("address", d.address);
    }
  }
};
</script>