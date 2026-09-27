/* Noticiasisa — narración accesible con Web Speech API */
(function () {
  'use strict';

  const playButton = document.getElementById('listenBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const stopButton = document.getElementById('stopBtn');
  const status = document.getElementById('listenStatus');
  const article = document.querySelector('.article-body');
  const title = document.querySelector('h1');
  const summary = document.querySelector('main section p.text-lg');

  if (!playButton || !playIcon || !pauseIcon || !stopButton || !status || !article || !title) {
    return;
  }

  const defaultStatus = 'Lectura automática en español · ideal si no quieres leer';
  const synthesis = window.speechSynthesis;

  if (!synthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
    status.textContent = 'Tu navegador no admite la lectura en voz alta.';
    playButton.disabled = true;
    playButton.setAttribute('aria-label', 'Lectura en voz alta no disponible');
    return;
  }

  const femaleVoiceHints = [
    'valentina', 'monica', 'sofia', 'paola', 'laura', 'ana', 'carla',
    'isabel', 'gabriela', 'sara', 'camila', 'julia', 'lucia', 'elena',
    'clara', 'natalia'
  ];

  let queue = [];
  let queueIndex = 0;
  let isPaused = false;
  let hasStarted = false;
  let sessionId = 0;

  function buildQueue() {
    const chunks = [];
    if (title.textContent.trim()) chunks.push(title.textContent.trim());
    if (summary && summary.textContent.trim()) chunks.push(summary.textContent.trim());

    article.querySelectorAll('h2, p, blockquote').forEach((node) => {
      const text = node.textContent.trim().replace(/\s+/g, ' ');
      if (!text) return;

      const sentences = text.match(/[^.!?…]+[.!?…]+["'”]?|[^.!?…]+$/g) || [text];
      sentences.forEach((sentence) => {
        const trimmed = sentence.trim();
        if (trimmed) chunks.push(trimmed);
      });
    });

    return chunks;
  }

  function getSpanishVoice() {
    const voices = synthesis.getVoices();
    const spanishVoices = voices.filter((voice) =>
      voice.lang && voice.lang.toLowerCase().startsWith('es')
    );

    const namedVoice = spanishVoices.find((voice) => {
      const name = voice.name.toLowerCase();
      return femaleVoiceHints.some((hint) => name.includes(hint));
    });

    if (namedVoice) return namedVoice;

    return spanishVoices.find((voice) => voice.lang.toLowerCase() === 'es-co')
      || spanishVoices.find((voice) => voice.name.toLowerCase().includes('google'))
      || spanishVoices[0]
      || voices[0]
      || null;
  }

  function updatePlayingUI() {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playButton.setAttribute('aria-label', 'Pausar narración');
    playButton.setAttribute('aria-pressed', 'true');
    stopButton.hidden = false;
    const progress = queue.length
      ? Math.min(100, Math.round(((queueIndex + 1) / queue.length) * 100))
      : 0;
    status.textContent = 'Narrando la noticia… (' + progress + '% aproximado)';
  }

  function resetUI(message = defaultStatus) {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playButton.setAttribute('aria-label', 'Escuchar la noticia narrada');
    playButton.setAttribute('aria-pressed', 'false');
    stopButton.hidden = true;
    status.textContent = message;
    isPaused = false;
    hasStarted = false;
    queueIndex = 0;
  }

  function speakChunk(index, currentSession) {
    if (currentSession !== sessionId) return;

    if (index >= queue.length) {
      resetUI('La narración ha terminado.');
      return;
    }

    queueIndex = index;
    const utterance = new SpeechSynthesisUtterance(queue[index]);
    const voice = getSpanishVoice();

    utterance.lang = voice ? voice.lang : 'es-CO';
    if (voice) utterance.voice = voice;
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (currentSession === sessionId) speakChunk(index + 1, currentSession);
    };
    utterance.onerror = (event) => {
      if (currentSession !== sessionId || event.error === 'canceled' || event.error === 'interrupted') return;
      resetUI('No se pudo continuar la narración. Inténtalo de nuevo.');
    };

    synthesis.speak(utterance);
    updatePlayingUI();
  }

  function startSpeaking() {
    queue = buildQueue();
    if (!queue.length) {
      resetUI('No hay texto disponible para narrar.');
      return;
    }

    hasStarted = true;
    isPaused = false;
    sessionId += 1;
    speakChunk(0, sessionId);
  }

  playButton.addEventListener('click', () => {
    if (synthesis.speaking && !isPaused) {
      synthesis.pause();
      isPaused = true;
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      playButton.setAttribute('aria-label', 'Reanudar narración');
      playButton.setAttribute('aria-pressed', 'false');
      status.textContent = 'Narración en pausa.';
      return;
    }

    if (isPaused) {
      synthesis.resume();
      isPaused = false;
      updatePlayingUI();
      return;
    }

    if (!hasStarted) {
      if (synthesis.getVoices().length === 0) {
        status.textContent = 'Cargando voces disponibles…';
        const onVoicesChanged = () => {
          if (synthesis.getVoices().length === 0) return;
          synthesis.removeEventListener('voiceschanged', onVoicesChanged);
          startSpeaking();
        };
        synthesis.addEventListener('voiceschanged', onVoicesChanged);
        // Algunos navegadores no disparan voiceschanged si no hay voces.
        window.setTimeout(() => {
          synthesis.removeEventListener('voiceschanged', onVoicesChanged);
          if (!hasStarted && synthesis.getVoices().length > 0) startSpeaking();
          else if (!hasStarted) resetUI('No se encontraron voces. Inténtalo de nuevo.');
        }, 1500);
      } else {
        startSpeaking();
      }
    }
  });

  stopButton.addEventListener('click', () => {
    sessionId += 1;
    synthesis.cancel();
    resetUI('Narración detenida.');
  });

  playButton.setAttribute('aria-pressed', 'false');
})();
