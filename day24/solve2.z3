(declare-const X Int)
(declare-const Y Int)
(declare-const Z Int)

(declare-const DX Int)
(declare-const DY Int)
(declare-const DZ Int)

(declare-const T1 Int)
(declare-const T2 Int)
(declare-const T3 Int)

(declare-const x1 Int)
(declare-const x2 Int)
(declare-const x3 Int)

(declare-const y1 Int)
(declare-const y2 Int)
(declare-const y3 Int)

(declare-const z1 Int)
(declare-const z2 Int)
(declare-const z3 Int)

(declare-const dx1 Int)
(declare-const dx2 Int)
(declare-const dx3 Int)

(declare-const dy1 Int)
(declare-const dy2 Int)
(declare-const dy3 Int)

(declare-const dz1 Int)
(declare-const dz2 Int)
(declare-const dz3 Int)

(assert (= x1 230027994633462))
(assert (= x2 213762157019377))
(assert (= x3 236440979253526))

(assert (= y1 224850233272831))
(assert (= y2 204038908928791))
(assert (= y3 104012423941037))

(assert (= z1 164872865225455))
(assert (= z2 198113097692531))
(assert (= z3 223798957622735))

(assert (= dx1 103))
(assert (= dx2 184))
(assert (= dx3 15))

(assert (= dy1 -57))
(assert (= dy2 -110))
(assert (= dy3 694))

(assert (= dz1 285))
(assert (= dz2 174))
(assert (= dz3 -277))

(assert (= X (+ x1 (* T1 (- dx1 DX)))))
(assert (= X (+ x2 (* T2 (- dx2 DX)))))
(assert (= X (+ x3 (* T3 (- dx3 DX)))))

(assert (= Y (+ y1 (* T1 (- dy1 DY)))))
(assert (= Y (+ y2 (* T2 (- dy2 DY)))))
(assert (= Y (+ y3 (* T3 (- dy3 DY)))))

(assert (= Z (+ z1 (* T1 (- dz1 DZ)))))
(assert (= Z (+ z2 (* T2 (- dz2 DZ)))))
(assert (= Z (+ z3 (* T3 (- dz3 DZ)))))


(declare-const XYZ Int)
(assert (= XYZ (+ X Y Z)))
(check-sat)
(get-model)
