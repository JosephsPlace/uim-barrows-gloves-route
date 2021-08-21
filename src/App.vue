<template>
  <div class="container">
    <div v-for="step in route.steps" :key="step" class="box">
      <div @click="toggleStepDisplay(step.unique_key)" class="step-header">
        <div class="title is-3">
          <div class="stylized-checkbox">
            <input
              :id="'step_' + step.unique_key"
              type="checkbox"
              disabled
              v-model="completed_steps[step.unique_key].step_status"
            />
            <label :for="'step_' + step.unique_key">
              <span class="checkbox-display"></span>
              <span class="main-step-title-text">
                {{ step.step_name }}
              </span>
            </label>
          </div>

          <div class="subtitle is-4 is-inline-block is-marginless">
            {{ completed_steps[step.unique_key].substeps_completed }} /
            {{ completed_steps[step.unique_key].total_substeps }}
          </div>

          <div class="is-inline-block is-pulled-right">
            <span
              class="icon"
              v-if="this.step_is_collapsed[step.unique_key] === true"
            >
              <font-awesome-icon :icon="['fas', 'angle-right']" />
            </span>

            <span
              class="icon"
              v-if="this.step_is_collapsed[step.unique_key] === false"
            >
              <font-awesome-icon :icon="['fas', 'angle-down']" />
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="this.step_is_collapsed[step.unique_key] !== true"
        class="substep-container"
      >
        <div v-for="(substep, substep_index) in step.substeps" :key="substep">
          <input
            type="checkbox"
            @change="updateStepSelections(step.unique_key)"
            v-model="
              completed_steps[step.unique_key].substeps[substep.unique_key]
            "
          />

          {{ substep_index + 1 }}: {{ substep.text }}
          <br />
          {{ substep.subtext }}
          <br />
          Substep Status:
          {{ completed_steps[step.unique_key].substeps[substep.unique_key] }}
          <br />
          Example Inv Images:
          <inventory
            :item_data="item_data"
            :items="example_inventory[substep.unique_key]"
          ></inventory>
        </div>
      </div>
    </div>

    <div class="has-text-centered">
      <button class="button is-primary" @click="clearStorage">
        Reset Progress
      </button>
    </div>
  </div>
</template>

<script>
import json from './assets/data/route.json'
import axios from 'axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleRight)
library.add(faAngleDown)

export default {
  data() {
    return {
      route: json,
      completed_steps: {},
      step_is_collapsed: {},
      example_inventory: [],
      item_data: [],
    }
  },
  created() {
    // The current data in local storage
    let saved_item_data = this.getSavedData('item_data')
    if (saved_item_data !== null) {
      this.item_data = saved_item_data
    }
    let saved_data = this.getSavedData('route_progress')
    let current_inventory = []

    // Loop through each step and check the saved data to see if it needs to be checked off
    this.route.steps.forEach((step) => {
      const current_step_status =
        saved_data !== null &&
        typeof saved_data[step.unique_key] !== 'undefined' &&
        saved_data[step.unique_key].step_status === true

      this.completed_steps[step.unique_key] = {
        step_status: current_step_status,
        total_substeps: step.substeps.length,
        substeps_completed: 0,
        substeps: {},
      }

      step.substeps.forEach((substep) => {
        const current_substep_status =
          saved_data !== null &&
          typeof saved_data[step.unique_key] !== 'undefined' &&
          saved_data[step.unique_key].substeps !== null &&
          saved_data[step.unique_key].substeps[substep.unique_key] === true
        if (current_substep_status === true) {
          this.completed_steps[step.unique_key].substeps_completed++
        }

        this.completed_steps[step.unique_key].substeps[substep.unique_key] =
          current_substep_status

        if (
          typeof substep.add_items !== 'undefined' &&
          substep.add_items.length > 0
        ) {
          substep.add_items.forEach((item) => {
            this.addItemToInventory(current_inventory, item)
          })
        }

        if (
          typeof substep.remove_items !== 'undefined' &&
          substep.remove_items.length > 0
        ) {
          substep.remove_items.forEach((item) => {
            this.removeItemFromInventory(current_inventory, item)
          })
        }

        // We need to copy the inventory at this exact moment, not store a reference to the variable
        this.example_inventory[substep.unique_key] = JSON.parse(
          JSON.stringify(current_inventory)
        )
      })

      // If all substeps are completed, collapse the step on page load
      this.step_is_collapsed[step.unique_key] = false
      if (
        this.completed_steps[step.unique_key].total_substeps ===
        this.completed_steps[step.unique_key].substeps_completed
      ) {
        this.step_is_collapsed[step.unique_key] = true
      }
    })

    // TODO: Add an actual design - https://dribbble.com/shots/15637013-Teamwork-Dashboard-concept-redesign
  },
  methods: {
    toggleStepDisplay(key) {
      this.step_is_collapsed[key] = !this.step_is_collapsed[key]
    },
    getItemData(id) {
      if (
        typeof this.item_data[id] === 'undefined' ||
        this.item_data[id] === null
      ) {
        axios
          .get('https://www.osrsbox.com/osrsbox-db/items-json/' + id + '.json')
          .then((res) => {
            this.item_data[id] = res.data
            // Cache the data for future page loads so we don't need to ping the endpoint every time
            this.saveData('item_data', this.item_data)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    addItemToInventory(array, id) {
      array.push(id)
      this.getItemData(id)
    },
    removeItemFromInventory(array, id) {
      const index = array.indexOf(id)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    updateStepSelections(key) {
      let substeps_completed = 0
      Object.values(this.completed_steps[key].substeps).forEach((substep) => {
        if (substep === true) {
          substeps_completed++
        }
      })
      this.completed_steps[key].substeps_completed = substeps_completed

      if (
        this.completed_steps[key].substeps_completed ===
        this.completed_steps[key].total_substeps
      ) {
        // All steps completed
        this.step_is_collapsed[key] = this.completed_steps[
          key
        ].step_status = true
      } else {
        this.step_is_collapsed[key] = this.completed_steps[
          key
        ].step_status = false
      }
      this.saveData('route_progress', this.completed_steps)
    },
    clearStorage() {
      localStorage.clear()
    },
    getSavedData(key) {
      return JSON.parse(localStorage.getItem(key))
    },
    saveData(key, data) {
      localStorage.setItem(key, JSON.stringify(data))
    },
  },
}
</script>

<style></style>
