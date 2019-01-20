<template>
  <md-dialog :md-active.sync="active" :md-click-outside-to-close="false">
    <md-dialog-title>{{ title }}</md-dialog-title>

    <md-dialog-content>
      <!-- <form novalidate class="md-layout" @submit.prevent="validateAdd"> -->
      <md-field :class="validateClass('title')">
        <label>Title</label>
        <md-input v-model="event.title"></md-input>
        <span class="md-error" v-if="!$v.event.title.required">The title is required</span>
        <span class="md-error" v-else-if="!$v.event.title.minlength">
            Title must be at least {{$v.event.title.$params.minLength.min}} letters.
        </span>
        <span class="md-error" v-else-if="!$v.event.title.maxlength">
            Title must be max {{$v.event.title.$params.maxLength.max}} letters.
        </span>
      </md-field>

      <md-field :class="validateClass('description')">
        <label>Description</label>
        <md-textarea v-model="event.description"></md-textarea>
        <span class="md-error" v-if="!$v.event.description.required">The description is required</span>
        <span class="md-error" v-else-if="!$v.event.description.minlength">
          Description must have at least {{$v.event.description.$params.minLength.min}} letters.
        </span>
        <span class="md-error" v-else-if="!$v.event.description.maxlength">
          Description must have max {{$v.event.description.$params.maxlength.max}} letters.
        </span>
      </md-field>

      <md-field :class="validateClass('price')">
        <label>Price</label>
        <md-input v-model="event.price" type="number"></md-input>
        <span class="md-error" v-if="!$v.event.price.required">The price is required</span>
        <span class="md-error" v-else-if="!$v.event.price.number">Price must be a number.</span>
        <span class="md-error" v-else-if="!$v.event.price.minValue">Price must be greater than zero.</span>
      </md-field>

      <md-datepicker v-model="event.dateAsDateObj" md-immediately :class="validateClass('dateAsDateObj')">
         <label>Date</label>
         <!-- <span class="md-error" v-if="!$v.event.dateAsDateObj.required">The date is required</span> -->
      </md-datepicker>

      <md-dialog-actions>
        <md-button class="md-primary" @click="active = false">Cancel</md-button>
        <md-button type="submit" class="md-primary" @click="doAction" :disabled="disabled">Submit</md-button>
      </md-dialog-actions>

      <!-- </form> -->
    </md-dialog-content>
  </md-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, decimal, minValue } from "vuelidate/lib/validators";

export default {
  props: {
    show: { type: Boolean, default: false },
    isCreate: { type: Boolean, default: true }
  },
  model: {
    prop: "show",
    event: "close"
  },
  computed: {
    title() {
      return this.isCreate ? "Create new event" : "Edit event";
    },
    active: {
      // getter
      get: function() {
        return !!this.show;
      },
      // setter
      set: function(newValue) {
        if (!newValue) {
          this.$emit("close");
        }
      }
    },
    disabled() {
      return false;
      // return this.$v.event.$invalid;
    }
  },
  data() {
    return {
      event: {
        title: null,
        description: null,
        price: null,
        date: null
      }
    };
  },
  watch: {
    // watch a nested property
    "event.date": function(newDate, old) {
      if (newDate === old) return;

      // 'newDate' is String object, so create a 'event.dateAsDateObj' as Date
      this.event.dateAsDateObj = newDate ? new Date(newDate) : null;
    },
    "event.dateAsDateObj": function(newDateReal, old) {
      if (newDateReal === old) return;

      // 'newDateReal' is Date object, so create a 'event.date' as String
      this.event.date = newDateReal ? newDateReal.toISOString() : null;
    }  
  },
  methods: {
    doAction() {
      // validate first and if any invalid field then return
      this.$v.event.$touch();

      if (this.$v.event.$invalid) {
        // validation errors are shown already when this.$v.event.$touch() is called
        return;
      }

      const event = this.event;

      this.event = {};
      this.$v.event.$reset();

      this.active = false;

      this.$emit("action", event);
    },

    validateClass(fieldName) {
      const field = this.$v.event[fieldName];
      return field ? { "md-invalid": field.$invalid && field.$dirty } : null;
    }
  },

  // Vuelidate integration
  mixins: [validationMixin],
  // validation schema can be a function if needed or just a schema object
  validations: {
    event: {
      title: {
        required: required,
        minLength: minLength(4),
        maxLength: maxLength(200)
      },
      description: {
        required,
        minLength: minLength(4)
      },
      price: {
        required,
        number: decimal, // Note: 'decimal' is the Vuelidate validator for a Float number (99.9)
        minValue: minValue(1),
        
      },
      dateAsDateObj: {
        required,
        // this validator is the only one needed as the Datepicker allows only Date as model
      }
    }
  }
};
</script>
