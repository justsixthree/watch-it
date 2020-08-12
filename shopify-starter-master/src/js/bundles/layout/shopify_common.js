/*
 * Shopify Common JS
 *
 */

// set a given selector with value, if value is one of the options
Shopify.setSelectorByValue = function(selector, value) {
    for (let i = 0, count = selector.options.length; i < count; i++) {
      const option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  };
  
  // send request as a POST
  Shopify.postLink = function(path, options) {
    options = options || {};
    const method = options['method'] || 'post';
    const params = options['parameters'] || {};
  
    const form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
  
    for(const key in params) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  
  /* CountryProvinceSelector
   * js class that adds listener to country selector and on change updates
   * province selector with valid province values.
   * Selector should be in this format:
   *
   *   <select id="country_selector" name="country" data-default="Canada">
   *     <option data-provinces="['Alberta','Ontario','British Columbia',...] value="Canada">Canada</option>
   *     ...
   *   </select>
   *   <select id="province_selector" name="province" data-default="Ontario">
   *     <option value="Ontario">Ontario</option>
   *     ...
   *   </select>
   */
  Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl         = document.getElementById(country_domid);
    this.provinceEl        = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
  
    this.countryEl.addEventListener('change', this.countryHandler.bind(this));
  
    this.initCountry();
    this.initProvince();
  };
  
  Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
      const value = this.countryEl.getAttribute('data-default');
      Shopify.setSelectorByValue(this.countryEl, value);
      this.countryHandler();
    },
  
    initProvince: function() {
      const value = this.provinceEl.getAttribute('data-default');
      if (value && this.provinceEl.options.length > 0) {
        Shopify.setSelectorByValue(this.provinceEl, value);
      }
    },
  
    countryHandler: function(e) {
      const opt       = this.countryEl.options[this.countryEl.selectedIndex];
      const raw       = opt.getAttribute('data-provinces');
      const provinces = JSON.parse(raw);
  
      this.clearOptions(this.provinceEl);
      if (provinces && provinces.length == 0) {
        this.provinceContainer.style.display = 'none';
      } else {
        this.setOptions(this.provinceEl, provinces);
        this.provinceContainer.style.display = "";
      }
    },
  
    clearOptions: function(selector) {
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
    },
  
    setOptions: function(selector, values) {
      for (let i = 0, count = values.length; i < values.length; i++) {
        const opt = document.createElement('option');
        opt.value = values[i][0];
        opt.innerHTML = values[i][1];
        selector.appendChild(opt);
      }
    }
  };