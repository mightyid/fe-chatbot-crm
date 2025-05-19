import { $Fetch } from 'nitropack'

declare module '#app' {
  interface NuxtApp {
    $api: $Fetch
  }
}
