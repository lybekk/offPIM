<template>
  <v-main>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <p class="text-center display-3">
            Tools.
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <v-card>
            <v-card-title><span class="title font-weight-light">Lookup document by ID</span></v-card-title>
            <v-card-text>
              <v-text-field
                v-model="idLookup"
                append-outer-icon="mdi-send"
                @click:append-outer="$store.dispatch('setRawDocumentViewerDocument', idLookup)"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-card>
            <v-card-title><span class="title font-weight-light">UUID Generator</span></v-card-title>
            <v-card-text>
              <v-btn
                color="secondary"
                fab
                x-small
                dark
                @click="generateUUID"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    :value="generatedUUID"
                    solo
                    readonly
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title><span class="title font-weight-light">Convert date string to ISO</span></v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="dateConverterInput"
                    solo
                    label="Enter date string"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    :value="dateConverterResult"
                    label="Result"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Tools",
  components: {},
  data: () => ({
    generatedUUID: "",
    dateConverterInput: null,
    idLookup: null,
  }),
  computed: {
    dateConverterResult: function() {
      const x = this.dateConverterInput;
      const y = new Date(x);
      return y.toISOString();
    },
  },
  created() {},
  mounted() {},
  methods: {
    generateUUID: function() {
      this.generatedUUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
};
</script>
