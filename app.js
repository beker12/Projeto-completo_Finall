document.addEventListener('DOMContentLoaded', function() {
  
  if (document.getElementById('admin-form')) {
    const ADMIN_STORAGE_KEY = 'nextstap_usuarios';
    
    carregarUsuarios();
    
    document.getElementById('admin-form').addEventListener('submit', cadastrarUsuario);
    document.getElementById('admin-limpar').addEventListener('click', limparCampos);
    document.getElementById('pesquisar').addEventListener('click', pesquisarUsuarios);
    document.getElementById('limpar-pesquisa').addEventListener('click', limparPesquisa);
    document.getElementById('excluir-todos').addEventListener('click', excluirTodos);

    function cadastrarUsuario(e) {
      e.preventDefault();
      
      const nome = document.getElementById('admin-nome').value.trim();
      const email = document.getElementById('admin-email').value.trim();
      
      if (!nome || !email) {
        alert('Por favor, preencha todos os campos!');
        return;
      }
      
      const dataEnvio = new Date().toLocaleString('pt-BR');
      const novoUsuario = {
        id: Date.now(),
        nome: nome,
        email: email,
        dataEnvio: dataEnvio
      };
      
      let usuarios = [];
      const usuariosStorage = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (usuariosStorage) {
        usuarios = JSON.parse(usuariosStorage);
      }
      
      usuarios.push(novoUsuario);
      
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(usuarios));
      
      limparCampos();
      carregarUsuarios();
      
      alert('Usuário cadastrado com sucesso!');
    }

    function carregarUsuarios(usuariosFiltrados = null) {
      const lista = document.getElementById('admin-lista');
      lista.innerHTML = '';
      
      let usuarios = [];
      const usuariosStorage = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (usuariosStorage) {
        usuarios = JSON.parse(usuariosStorage);
      }
      
      if (usuariosFiltrados) {
        usuarios = usuariosFiltrados;
      }
      
      if (usuarios.length === 0) {
        lista.innerHTML = '<li style="padding: 15px; color: #7f8c8d;">Nenhum usuário cadastrado.</li>';
        return;
      }
      
      usuarios.forEach(function(usuario) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>
            <strong>Nome:</strong> ${usuario.nome} | <strong>E-mail:</strong> ${usuario.email} | <strong>Data de envio:</strong> ${usuario.dataEnvio}
          </span>
          <button type="button" onclick="excluirUsuario(${usuario.id})" style="padding: 6px 12px; font-size: 0.9rem; background-color: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer;">Excluir</button>
        `;
        lista.appendChild(li);
      });
    }

    window.excluirUsuario = function(id) {
      if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return;
      }
      
      let usuarios = [];
      const usuariosStorage = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (usuariosStorage) {
        usuarios = JSON.parse(usuariosStorage);
      }
      
      usuarios = usuarios.filter(function(usuario) {
        return usuario.id !== id;
      });
      
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(usuarios));
      
      carregarUsuarios();
      
      alert('Usuário excluído com sucesso!');
    };

    function excluirTodos() {
      if (!confirm('Tem certeza que deseja excluir TODOS os usuários? Esta ação não pode ser desfeita!')) {
        return;
      }
      
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      
      carregarUsuarios();
      
      alert('Todos os usuários foram excluídos!');
    }

    function pesquisarUsuarios() {
      const termo = document.getElementById('admin-pesquisa').value.trim().toLowerCase();
      
      if (!termo) {
        alert('Por favor, digite um termo para pesquisar!');
        return;
      }
      
      let usuarios = [];
      const usuariosStorage = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (usuariosStorage) {
        usuarios = JSON.parse(usuariosStorage);
      }
      
      const usuariosFiltrados = usuarios.filter(function(usuario) {
        const nomeMatch = usuario.nome.toLowerCase().includes(termo);
        const emailMatch = usuario.email.toLowerCase().includes(termo);
        return nomeMatch || emailMatch;
      });
      
      carregarUsuarios(usuariosFiltrados);
      
      if (usuariosFiltrados.length === 0) {
        alert('Nenhum usuário encontrado com o termo pesquisado.');
      }
    }

    function limparPesquisa() {
      document.getElementById('admin-pesquisa').value = '';
      carregarUsuarios();
    }

    function limparCampos() {
      document.getElementById('admin-nome').value = '';
      document.getElementById('admin-email').value = '';
    }
  }

  if (document.getElementById('form-login')) {
    document.getElementById('form-login').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      
      const usuariosStorage = localStorage.getItem('nextstap_cadastros');
      if (usuariosStorage) {
        const usuarios = JSON.parse(usuariosStorage);
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (usuario) {
          alert('Login realizado com sucesso!');
          window.location.href = 'produtos.html';
        } else {
          alert('E-mail ou senha incorretos!');
        }
      } else {
        alert('Nenhum usuário cadastrado!');
      }
    });
  }

  if (document.getElementById('form-cadastro')) {
    document.getElementById('form-cadastro').addEventListener('submit', function(e) {
      e.preventDefault();
      const usuario = document.getElementById('usuario').value;
      const nascimento = document.getElementById('nascimento').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      const confirma = document.getElementById('confirma').value;
      
      if (senha !== confirma) {
        alert('As senhas não coincidem!');
        return;
      }
      
      let cadastros = [];
      const cadastrosStorage = localStorage.getItem('nextstap_cadastros');
      if (cadastrosStorage) {
        cadastros = JSON.parse(cadastrosStorage);
      }
      
      if (cadastros.find(c => c.email === email)) {
        alert('Este e-mail já está cadastrado!');
        return;
      }
      
      cadastros.push({
        usuario: usuario,
        nascimento: nascimento,
        email: email,
        senha: senha
      });
      
      localStorage.setItem('nextstap_cadastros', JSON.stringify(cadastros));
      
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    });
  }

  if (document.getElementById('modal-compra')) {
    const modal = document.getElementById('modal-compra');
    const comprarBtns = document.querySelectorAll('.comprar');
    const modalCancelar = document.getElementById('modal-cancelar');
    const modalConfirmar = document.getElementById('modal-confirmar');
    
    comprarBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const produto = this.getAttribute('data-produto');
        document.getElementById('modal-produto-nome').textContent = 'Finalizar compra - ' + produto;
        modal.style.display = 'block';
      });
    });
    
    modalCancelar.addEventListener('click', function() {
      modal.style.display = 'none';
      document.getElementById('modal-local').value = '';
    });
    
    modalConfirmar.addEventListener('click', function() {
      const local = document.getElementById('modal-local').value.trim();
      if (!local) {
        alert('Por favor, informe o local de entrega!');
        return;
      }
      alert('Compra confirmada! Entregaremos em ' + local + '. Obrigado pela compra!');
      modal.style.display = 'none';
      document.getElementById('modal-local').value = '';
    });
    
    window.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  const acessibilidade = document.getElementById('acessibilidade');
  if (acessibilidade) {
    acessibilidade.addEventListener('click', function() {
      document.body.classList.toggle('fonte-grande');
    });
  }

  const contraste = document.getElementById('contraste');
  if (contraste) {
    contraste.addEventListener('click', function() {
      document.body.classList.toggle('alto-contraste');
    });
  }
});
