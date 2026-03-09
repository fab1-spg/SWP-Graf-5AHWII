//Exception-Beispiel mit Schulnoten
function pruefeNoteException(note) {
  if (note < 1 || note > 5) {
    throw new Error("Ungültig: Schulnote muss zwischen 1 und 5 liegen.");
  }
  return `Erfolg: Die Note ${note} wurde gespeichert.`;
}

console.log("--- Exception Stil ---");

try {
  const successMessage = pruefeNoteException(6); 
  console.log(successMessage);
} catch (error) {
  console.error("Fehler gefangen:", error.message);
}

//Result-Beispiel mit Schulnoten

function pruefeNoteResult(note) {
  if (note < 1 || note > 5) {
    return { ok: false, error: "Ungültige: Schulnote muss zwischen 1 und 5 liegen." };
  }
  return { ok: true, value: `Erfolg: Die Note ${grade} wurde gespeichert.` };
}

console.log("\n--- Result Stil ---");


const result = pruefeNoteResult(6);
if (result.ok) {
  console.log(result.value);
} else {
  console.error("Fehler aufgetreten:", result.error);
}


