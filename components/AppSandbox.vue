<template>
  <h1>
    RELAXXED ALCOHOL UNIVERSE
  </h1>
  <div>
    <h2>Welcome</h2>
    <p>Simple text</p>
    <!-- <div class="spinner-loader" /> -->
    <table>
      <tbody>
        <tr>
          <td>
            <a href="https://svgoptimizer.com/">Lien</a><br>
          </td>
          <td>
            <a href="https://svgoptimizer.com/" class="secondary">Lien secondary</a><br>
          </td>
          <td>
            <a href="https://svgoptimizer.com/" class="secondary amzn">Lien secondary amzn</a><br>
          </td>
          <td>
            <a href="https://svgoptimizer.com/" class="amzn">Lien amzn</a><br>
          </td>
        </tr>
        <tr>
          <td>
            <button>button</button>
          </td>
          <td>
            <button class="secondary">
              button secondary
            </button>
          </td>
          <td>
            <button class="secondary outline">
              button secondary outline
            </button>
          </td>
          <td>
            <button class="outline">
              button outline
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="small">
              button
            </button><br>
          </td>
          <td>
            <button class="secondary small">
              button secondary
            </button>
          </td>
          <td>
            <button class="secondary outline small">
              button secondary outline
            </button>
          </td>
          <td>
            <button class="outline small">
              button outline
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="amzn">
              button
            </button><br>
          </td>
          <td>
            <button class="secondary amzn">
              button secondary
            </button>
          </td>
          <td>
            <button class="secondary outline amzn">
              button secondary outline
            </button>
          </td>
          <td>
            <button class="outline amzn">
              button outline
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="amzn small">
              button
            </button><br>
          </td>
          <td>
            <button class="secondary amzn small">
              button secondary
            </button>
          </td>
          <td>
            <button class="secondary outline amzn small">
              button secondary outline
            </button>
          </td>
          <td>
            <button class="outline amzn small">
              button outline
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      <button class="max-width">
        button max-width
      </button>
    </p>
    <p>
      <button style="--button-width: 50%;">
        button width: 50%
      </button>
    </p>
  </div>
  <!-- <div class="alert-box alert-box--warning" role="alert">
    <div class="alert-box__inner">
      <span>icon</span>
      <div class="alert-box__main">
        <div class="alert-box__title">
          title
        </div>
        <div class="alert-box__content">
          content
        </div>
      </div>
    </div>
    <div class="alert-box__buttons">
      <button>button</button>
    </div>
  </div> -->
  <div class="flex-row flex-row--column-until-phone">
    <div class="card" style="width: 50%">
      <div class="card__title">
        title
      </div>
      <div class="card__content">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</div>
        <a href="" class="card__link">
          Voir plus
        </a>
      </div>
    </div>
    <div class="card" style="width: 50%">
      <div class="card__title">
        title
      </div>
      <div class="card__content">
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</div>
        <a href="" class="card__link">
          Voir plus
        </a>
      </div>
    </div>
  </div>
  <div>
    <img src="~/assets/images/relaxxed-alcohol-universe-logo.svg" alt="Relaxxed alcohol universe" width="300" height="300">
  </div>
</template>

<style lang="sass" scoped>
@use '@/assets/styles/components/alcohol-button'
@use '@/assets/styles/components/alcohol-card'
@use '@/assets/styles/components/titles'
</style>
