let inventory = [];

// Salva o inventário no localStorage
function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Carrega o inventário do localStorage
function loadInventory() {
  const data = localStorage.getItem("inventory");
  if (data) {
    inventory = JSON.parse(data);
    renderInventory();
  }
}

// Adiciona novo produto ao inventário
function addNewProduct() {
  const code = document.getElementById("new-code").value.trim();
  const name = document.getElementById("new-name").value.trim();
  const quantity = parseInt(document.getElementById("new-quantity").value);
  const price = parseFloat(document.getElementById("new-price").value);

  if (!code || !name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
    alert("Preencha todos os campos corretamente para inserir um novo produto.");
    return;
  }

  if (inventory.find(p => p.code === code)) {
    alert("Produto com esse código já existe.");
    return;
  }

  inventory.push({ code, name, quantity, price });
  renderInventory();
  saveInventory();
  clearFields("new");
  alert("Produto cadastrado com sucesso!");
}

// Registra entrada de produto
function addEntry() {
  const code = document.getElementById("entry-code").value.trim();
  const quantity = parseInt(document.getElementById("entry-quantity").value);

  if (!code || isNaN(quantity) || quantity <= 0) {
    alert("Informe corretamente o código e a quantidade.");
    return;
  }

  const product = inventory.find(p => p.code === code);
  if (!product) {
    alert("Produto não encontrado.");
    return;
  }

  product.quantity += quantity;
  renderInventory();
  saveInventory();
  clearFields("entry");
  alert(`Entrada de ${quantity} unidades do produto "${product.name}" registrada com sucesso!`);
}

// Registra saída de produto
function addExit() {
  const code = document.getElementById("exit-code").value.trim();
  const quantity = parseInt(document.getElementById("exit-quantity").value);

  if (!code || isNaN(quantity) || quantity <= 0) {
    alert("Informe corretamente o código e a quantidade.");
    return;
  }

  const product = inventory.find(p => p.code === code);
  if (!product) {
    alert("Produto não encontrado.");
    return;
  }

  if (product.quantity < quantity) {
    alert("Estoque insuficiente.");
    return;
  }

  product.quantity -= quantity;
  renderInventory();
  saveInventory();
  clearFields("exit");
  alert(`Saída de ${quantity} unidades do produto "${product.name}" registrada com sucesso!`);
}

// Renderiza a lista de produtos e o resumo
function renderInventory() {
  const list = document.getElementById("product-list");
  const totalQuantityEl = document.getElementById("total-quantity");
  const totalValueEl = document.getElementById("total-value");

  list.innerHTML = "";
  let totalQuantity = 0;
  let totalValue = 0;

  inventory.forEach(p => {
    const total = p.quantity * p.price;
    totalQuantity += p.quantity;
    totalValue += total;

    const li = document.createElement("li");
    li.innerHTML = `
      Código: ${p.code} | Nome: ${p.name} | Quantidade: ${p.quantity} | 
      Valor Unitário: R$${p.price.toFixed(2)} | Valor Total: R$${total.toFixed(2)}
      <button onclick="removeProduct('${p.code}')" 
        style="margin-left:10px; background-color: #A63A50; color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer;">
        Remover
      </button>
    `;
    list.appendChild(li);
  });

  totalQuantityEl.textContent = `Quantidade Total: ${totalQuantity}`;
  totalValueEl.textContent = `Valor Total: R$ ${totalValue.toFixed(2)}`;
}

// Remove produto pelo código
function removeProduct(code) {
  const confirmRemove = confirm("Tem certeza que deseja remover este produto?");
  if (!confirmRemove) return;

  inventory = inventory.filter(p => p.code !== code);
  renderInventory();
  saveInventory();
  alert("Produto removido com sucesso!");
}

// Limpa os campos de input após ação
function clearFields(type) {
  if (type === "new") {
    document.getElementById("new-code").value = "";
    document.getElementById("new-name").value = "";
    document.getElementById("new-quantity").value = "";
    document.getElementById("new-price").value = "";
  } else if (type === "entry") {
    document.getElementById("entry-code").value = "";
    document.getElementById("entry-quantity").value = "";
  } else if (type === "exit") {
    document.getElementById("exit-code").value = "";
    document.getElementById("exit-quantity").value = "";
  }
}

// Carrega inventário salvo ao abrir a página
window.onload = function () {
  loadInventory();
};
